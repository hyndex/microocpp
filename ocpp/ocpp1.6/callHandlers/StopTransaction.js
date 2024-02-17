const getModels = require('../../../models');

module.exports = async (payload, { callResult, callError }) => {
  const db = getModels;
  const transaction = await db.sequelize.transaction();
  try {
    const session = await db.ChargingSession.findOne(
      {
        where: { transactionId: payload.transactionId },
      },
      { transaction },
    );

    if (session) {
      session.endTime = new Date(payload.timestamp);
      session.meterStop = payload.meterStop;
      // Update additional fields as necessary
      await session.save({ transaction });
    }

    await transaction.commit();
    callResult({ idTagInfo: { status: 'Accepted' } });
  } catch (error) {
    await transaction.rollback();
    callError(error.message);
  }
};
