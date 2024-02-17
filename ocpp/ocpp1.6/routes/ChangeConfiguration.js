// Assuming connectedCps.js is used for managing WebSocket connections
const connectedCps = require('../connectedCps');

function changeConfiguration(req, res) {
  try {
    const { cpid, key, value } = req.body;
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    const payload = {
      key,
      value,
    };

    device
      .sendCall('ChangeConfiguration', payload)
      .then(response => {
        res.status(200).send({
          status: 'Accepted',
          message: 'Change configuration command processed.',
          configurationStatus: response.status,
          details: response,
        });
      })
      .catch(error => {
        console.error(`Error sending ChangeConfiguration to ${cpid}:`, error);
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in ChangeConfiguration for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = changeConfiguration;
