const getModels = require('../../../models');
const { getChargerQueue } = require('../../../utils/queue/remoteStartQueue');
const { getIdTagDetails } = require('../globalDBUtils');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    const { txnId, limit, limitType } = await getChargerQueue(chargepointId);

    const { connectorId, idTag, meterStart, timestamp } = payload;

    const connector = await db.Connector.findOne({
      where: { ConnectorId: connectorId, charger_id: chargepointId },
    });

    const tagDetails = await getIdTagDetails(idTag);

    await db.ChargingSession.create({
      transactionId: txnId,
      connectorId: connector.id,
      meterStart,
      startTime: new Date(timestamp),
      idTagId: tagDetails.id,
      userId: tagDetails.userId,
      limit,
      limitType,
    });

    callResult({ transactionId: txnId, idTagInfo: { status: 'Accepted' } });
  } catch (error) {
    console.error('Error handling startTransaction:', error);
    callError('InternalError');
  }
};
