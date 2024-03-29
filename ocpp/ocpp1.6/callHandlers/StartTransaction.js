const getModels = require('../../../models');
const {
  generateUniqueTransactionId,
} = require('../../../utils/queue/generateTransactionId');
const { getChargerQueue } = require('../../../utils/queue/remoteStartQueue');
const { getIdTagDetails } = require('../globalDBUtils');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    let { txnId, limit, limitType } = await getChargerQueue(chargepointId);
    const { connectorId, idTag, meterStart, timestamp } = payload;

    if (!txnId) {
      txnId = await generateUniqueTransactionId();

      const tagDetails = await getIdTagDetails(idTag);
      const user = await db.User.findOne({
        where: { id: tagDetails.userId },
        attributes: ['id', 'wallet_amount'],
      });

      const charger = await db.Charger.findOne({
        where: { id: chargepointId },
        include: [
          {
            model: db.Connector,
            where: { connectorId },
            attributes: ['tariff_rate'],
          },
        ],
      });

      const tariffRate = charger.Connectors[0].dataValues.tariff_rate;
      limit = user.wallet_amount / tariffRate;
      limitType = 'KWH';
    }

    const connector = await db.Connector.findOne({
      where: { connectorId, charger_id: chargepointId },
    });

    const tagDetails = await getIdTagDetails(idTag);

    await db.ChargingSession.create({
      transactionId: txnId,
      connectorId: connector.id,
      meterStart,
      startTime: new Date(timestamp),
      idTagId: tagDetails.id,
      userId: tagDetails.userId,
      chargerId: connector.charger_id,
      limit,
      limitType,
    });

    callResult({ transactionId: txnId, idTagInfo: { status: 'Accepted' } });
  } catch (error) {
    console.error('Error handling startTransaction:', error);
    callError('InternalError');
  }
};
