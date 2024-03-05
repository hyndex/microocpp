const { get } = require('lodash');
const getModels = require('../../../models');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;

    callResult({
      currentTime: new Date().toISOString(),
      interval: 60,
      status: 'Accepted',
    });

    await db.Charger.update(
      {
        lastHeartbeat: new Date(),
        model: get(payload, 'chargePointModel'),
        vendor: get(payload, 'chargePointVendor'),
      },
      { where: { id: chargepointId } },
    );
  } catch (error) {
    callError(error.message);
  }
};
