const getModels = require('../../../models');

module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    await db.Connector.update(
      { status: payload.status },
      {
        where: {
          id: payload.connectorId,
          include: [
            {
              model: db.Charger,
              where: {
                uuid: chargepointId,
              },
            },
          ],
        },
      },
    );
    callResult({});
  } catch (error) {
    callError(error.message);
  }
};
