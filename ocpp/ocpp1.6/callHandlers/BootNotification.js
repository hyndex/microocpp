const getModels = require('../../../models');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    await db.Charger.update(
      { lastHeartbeat: new Date() },
      { where: { id: chargepointId } },
    );
    callResult({
      currentTime: new Date().toISOString(),
      interval: 60,
      status: 'Accepted',
    });
  } catch (error) {
    callError(error.message);
  }
};
