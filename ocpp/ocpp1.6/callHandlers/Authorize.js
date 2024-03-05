const getModels = require('../../../models');

// eslint-disable-next-line no-unused-vars
module.exports = async (payload, { callResult, callError }, chargepointId) => {
  try {
    const db = getModels;
    const idTag = await db.IdTag.findOne({
      where: { tag_value: payload.idTag },
    });
    if (idTag && !idTag.isBlocked && !idTag.isExpired) {
      callResult({ idTagInfo: { status: 'Accepted' } });
    } else {
      callResult({ idTagInfo: { status: 'Blocked' } });
    }
  } catch (error) {
    callError(error.message);
  }
};
