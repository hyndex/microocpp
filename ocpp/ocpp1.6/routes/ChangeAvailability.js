const connectedCps = require('../connectedCps');

function changeAvailability(req, res) {
  try {
    const { cpid, connectorId, type } = req.body;
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    device
      .sendCall('ChangeAvailability', {
        connectorId,
        type,
      })
      .then(response => {
        res.status(200).send({
          status: 'Accepted',
          message: 'Change availability command processed.',
          details: response,
        });
      })
      .catch(error => {
        console.error(`Error sending ChangeAvailability to ${cpid}:`, error);
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
          details: error,
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in changeAvailability for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = changeAvailability;
