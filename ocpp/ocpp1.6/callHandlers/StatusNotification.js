const getModels = require('../../../models');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    await db.Connector.update(
      { status: payload.status },
      { where: { id: payload.connectorId, ChargerId: chargepointId } },
    );
    callResult({});
  } catch (error) {
    callError(error.message);
  }
};
