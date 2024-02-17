const connectedCps = require('../connectedCps');

function triggerMessage(req, res) {
  try {
    const { cpid, requestedMessage, connectorId } = req.body; // connectorId is optional
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    device
      .sendCall('TriggerMessage', { requestedMessage, connectorId })
      .then(response => {
        res.status(200).send({
          status: 'Accepted',
          message: 'Trigger message command processed.',
          details: response,
        });
      })
      .catch(error => {
        console.error(`Error sending TriggerMessage to ${cpid}:`, error);
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in TriggerMessage for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = triggerMessage;
