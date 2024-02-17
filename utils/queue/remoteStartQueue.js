const _ = require('lodash');

const localStorage = {};

const getQueueKey = cpid => `chargingqueue:${cpid}`;

module.exports.setChargerQueue = async (cpid, data) => {
  const key = getQueueKey(cpid);
  if (!_.isEmpty(localStorage[key])) {
    return false;
  }
  localStorage[key] = JSON.stringify(data);
  const timeout = 120; // Default timeout value in seconds
  setTimeout(() => delete localStorage[key], timeout * 1000); // Convert seconds to milliseconds
  return true;
};

// Get the charger queue
module.exports.getChargerQueue = async cpid => {
  const key = getQueueKey(cpid);
  const queue = localStorage[key];
  if (_.isEmpty(queue)) {
    return false;
  }
  return JSON.parse(queue);
};

// Delete the charger queue
module.exports.deleteChargerQueue = async cpid => {
  const key = getQueueKey(cpid);
  if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
    delete localStorage[key];
    return true;
  }
  return false;
};
