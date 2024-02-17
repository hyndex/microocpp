const connectedCps = require('../connectedCps');

function unlockConnector(req, res) {
  try {
    const { cpid, connectorId } = req.body;
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    device
      .sendCall('UnlockConnector', { connectorId })
      .then(response => {
        // Assuming the response object correctly reflects the outcome
        res.status(200).send({
          status: 'Accepted',
          message: 'Unlock connector command processed.',
          details: response,
        });
      })
      .catch(error => {
        console.error(`Error sending UnlockConnector to ${cpid}:`, error);
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in UnlockConnector for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = unlockConnector;
