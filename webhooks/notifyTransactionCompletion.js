const axios = require('axios');

module.exports.notifyTransactionCompletion = async session => {
  try {
    const response = await axios.post(
      process.env.TRANSACTION_COMPLETION_WEBHOOK_URL,
      {
        transactionId: session.transactionId,
        meterStart: session.meterStart,
        meterStop: session.meterStop,
        startTime: session.startTime,
        endTime: session.endTime,
      },
    );
    console.log('Transaction completion notification sent:', response.data);
  } catch (error) {
    console.error('Error sending transaction completion notification:', error);
  }
};
