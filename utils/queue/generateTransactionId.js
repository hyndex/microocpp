const { isNaN } = require('lodash');
const getModels = require('../../models');

// Function to find the maximum transaction ID and add 1
async function generateUniqueTransactionId() {
  const db = getModels;
  const maxTransactionIdResult = await db.ChargingSession.max('transactionId');

  // If there are no rows, max will return NULL. So, start with 1
  let nextTransactionId = 1;
  if (maxTransactionIdResult !== null && !isNaN(maxTransactionIdResult)) {
    nextTransactionId = maxTransactionIdResult + 1;
  }

  return nextTransactionId;
}

module.exports.generateUniqueTransactionId = generateUniqueTransactionId;
