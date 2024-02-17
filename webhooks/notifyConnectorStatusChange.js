const axios = require('axios');

module.exports.notifyConnectorStatusChange = async connector => {
  try {
    const response = await axios.post(process.env.STATUS_CHANGE_WEBHOOK_URL, {
      connectorId: connector.connectorId,
      chargerId: connector.ChargerId,
      status: connector.status,
    });
    console.log('Connector status change notification sent:', response.data);
  } catch (error) {
    console.error('Error sending connector status change notification:', error);
  }
};
