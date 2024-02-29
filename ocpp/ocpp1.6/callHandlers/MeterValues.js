const _ = require('lodash');
const async = require('async');
const getModels = require('../../../models');
const {
  meterValueCheckStopTransaction,
} = require('../../../utils/cron/meterValueCheckStopTransaction');
const connectedCps = require('../connectedCps');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  const { connectorId, transactionId, meterValue } = payload;

  if (!_.isArray(meterValue)) {
    return callError('FormationViolation');
  }

  try {
    const db = getModels;

    const [chargingSession, connector] = await Promise.all([
      db.ChargingSession.findOne({ where: { transactionId } }),
      db.Connector.findOne({
        where: { connectorId },
        include: [
          {
            model: db.Charger,
            where: {
              uuid: chargepointId,
            },
          },
        ],
      }),
    ]);

    if (!chargingSession || !connector) {
      return callError(
        'PropertyConstraintViolation',
        'Invalid transaction ID or connector ID',
      );
    }

    // Respond early, no need to wait for db write
    callResult({});

    const tasks = meterValue.flatMap(mv => {
      const timestamp = mv?.timestamp;
      const sampledValues = Array.isArray(mv?.sampledValue)
        ? mv.sampledValue
        : [];

      return sampledValues.map(sv => async () => {
        const { measurand, value, context, format, location, unit } = sv;
        const meterValueAttributes = {
          ChargingSessionId: chargingSession.id,
          timestamp,
          value,
          context,
          format,
          measurand,
          location,
          unit,
        };

        await db.MeterValue.upsert(meterValueAttributes);

        // Check for stop transaction
        const needToStopCharge = await meterValueCheckStopTransaction({
          chargingSessionId: chargingSession.id,
        });
        if (needToStopCharge) {
          const device = connectedCps.get(chargepointId);
          if (device) {
            const stopResult = await device.sendCall('RemoteStopTransaction', {
              transactionId: _.toNumber(transactionId),
            });
            console.log(
              `Stop transaction result for ${transactionId}:`,
              stopResult,
            );
          } else {
            console.error(
              `Device not found for chargepointId: ${chargepointId}`,
            );
          }
        }
      });
    });

    // Execute tasks sequentially
    await async.eachSeries(tasks, async task => task());
  } catch (err) {
    console.error('Error in meterValue processing:', err);
    callError(
      'InternalError',
      'An error occurred during meter value processing',
    );
  }
};
