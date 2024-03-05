const { formatISO, isDate } = require('date-fns');
const getModels = require('../../models');

// This function returns the charger with the specified chargerId
async function getCharger(chargerId) {
  try {
    const charger = await getModels.Charger.findOne({
      where: { id: chargerId },
    });
    return charger;
  } catch (error) {
    return null;
  }
}

async function getOrder(userId) {
  const order = await getModels.order.findByPk(userId);
  return order;
}

async function getIdTagDetails(idTag) {
  if (!idTag) return null;
  return getModels.IdTag.findOne({ where: { tag_value: idTag } });
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
