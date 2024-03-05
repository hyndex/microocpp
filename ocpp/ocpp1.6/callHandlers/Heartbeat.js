const getModels = require('../../../models');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    await db.Charger.update(
      { lastHeartbeat: new Date() },
      { where: { id: chargepointId } },
    );
    callResult({ currentTime: new Date().toISOString() });
  } catch (error) {
    callError(error.message);
  }
};
