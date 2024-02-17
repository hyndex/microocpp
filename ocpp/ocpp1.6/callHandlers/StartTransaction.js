const getModels = require('../../../models');
const { getChargerQueue } = require('../../../utils/queue/remoteStartQueue');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    const { txnId, connectorId, limit, limitType } = await getChargerQueue(
      chargepointId,
    );

    const { idTag, meterStart, timestamp } = payload;

    const connector = await db.Connector.findOne({
      ChargerId: chargepointId,
      ConnectorId: connectorId,
    });

    await db.ChargingSession.create({
      transactionId: txnId,
      ConnectorId: connector.id,
      meterStart,
      startTime: new Date(timestamp),
      idTagId: idTag,
      limit,
      limitType,
    });

    callResult({ transactionId: txnId, idTagInfo: { status: 'Accepted' } });
  } catch (error) {
    console.error('Error handling startTransaction:', error);
    callError('InternalError');
  }
};
