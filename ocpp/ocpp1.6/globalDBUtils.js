const { formatISO, isDate } = require('date-fns');
const _ = require('lodash');
const getModels = require('../../models');

// This function returns the charger with the specified chargerId
async function getCharger(chargerId) {
  const charger = await getModels.Charger.findByPk(chargerId);
  return charger;
}

async function getOrder(userId) {
  const order = await getModels.order.findByPk(userId);
  return order;
}

async function getIdTagDetails(idTag) {
  if (!idTag) return null;

  const zone = _.split(idTag, ':')[0];
  const db = _.attempt(getModels, zone);
  // In this case, return null
  if (_.isError(db)) {
    return null;
  }
  return db.IdTag.findByPk(idTag);
}

async function getIdTagInfo(idTag) {
  const idTagDetails = await getIdTagDetails(idTag);

  let status = 'Accepted';
  if (idTagDetails) {
    if (idTagDetails?.isBlocked) {
      status = 'Blocked';
    } else if (idTagDetails?.isExpired) {
      status = 'Expired';
    }
  } else {
    status = 'Invalid';
  }
  const parentIdtag = idTagDetails?.parentIdtag;
  const expiryDate = idTagDetails?.expiryDate;

  // Return an object with the idTag's status, parent idTag (if it exists), and expiry date (if it exists)
  return {
    status,
    parentIdTag: parentIdtag ?? undefined,
    expiryDate: isDate(expiryDate) ? formatISO(expiryDate) : undefined,
  };
}

// Export the functions as a module
module.exports = {
  getCharger,
  getOrder,
  getIdTagDetails,
  getIdTagInfo,
};
