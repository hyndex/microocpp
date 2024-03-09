const getModels = require('../../../models');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    callResult({});
    const db = getModels;
    const data = await db.Connector.update(
      { status: payload.status },
      {
        where: {
          connectorId: payload.connectorId,
          charger_id: chargepointId,
        },
      },
    );

    console.log(data);
  } catch (error) {
    callError(error.message);
  }
};
