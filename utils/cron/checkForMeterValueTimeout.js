const { Op } = require('sequelize');
const _ = require('lodash');
const getModels = require('../../models');

module.exports.checkForMeterValueTimeout = async () => {
  try {
    const db = getModels;

    const timeout = parseInt(process.env.METER_VALUE_TIMEOUT, 10) || 300; // Default to 5 minutes

    const sessions = await db.ChargingSession.findAll({
      where: {
        meterStop: null, // Only consider active sessions
        endTime: null,
        created_at: {
          [Op.lte]: new Date(new Date() - timeout * 1000),
        },
      },
    });

    await Promise.all(
      sessions.map(async session => {
        try {
          let meterValue = await db.MeterValue.findAll({
            where: {
              ChargingSessionId: session.id,
              [Op.or]: [{ unit: 'kWh' }, { unit: 'Wh' }],
            },
            attributes: [
              'id',
              'value',
              'unit',
              'format',
              'context',
              'measurand',
              'location',
              'ChargingSessionId',
            ], // Removed 'timestamp' from attributes
          });
          meterValue = _.get(meterValue, '[0]', null);
          if (meterValue === null) {
            meterValue = {
              dataValues: {
                measurand: 'Energy.Active.Export.Interval',
                unit: 'Wh',
                value: 0,
              },
            };
          }

          if (
            _.toLower(meterValue.dataValues.measurand) ===
              'energy.active.export.register' ||
            _.toLower(meterValue.dataValues.measurand) ===
              'energy.active.import.register'
          ) {
            meterValue.dataValues.measurand = 'Energy.Active.Export.Interval';
            meterValue.dataValues.value -= session.dataValues.meterStart / 1000;
          }

          meterValue.dataValues.value = _.toNumber(meterValue.dataValues.value);
          if (_.toLower(meterValue.dataValues.unit) === 'wh') {
            meterValue.dataValues.unit = 'kWh';
            meterValue.dataValues.value /= 1000;
          }

          const meterEnd =
            session.dataValues.meterStart + meterValue.dataValues.value * 1000; // Convert kWh to Wh
          await session.update({
            meterStop: meterEnd,
            endTime: new Date(),
            reason: 'Timeout',
          });
        } catch (innerError) {
          console.error(`Error processing session ${session.id}:`, innerError);
        }
      }),
    );
  } catch (error) {
    console.error('Error checking for meter value timeouts:', error);
  }
};
