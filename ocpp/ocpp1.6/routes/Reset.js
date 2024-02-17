const connectedCps = require('../connectedCps');

function reset(req, res) {
  try {
    const { cpid, type } = req.body; // type should be "Hard" or "Soft"
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    device
      .sendCall('Reset', { type })
      .then(response => {
        res.status(200).send({
          status: 'Accepted',
          message: 'Reset command processed.',
          details: response,
        });
      })
      .catch(error => {
        console.error(`Error sending Reset to ${cpid}:`, error);
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(`Unexpected error in Reset for ${req.body.cpid}:`, error);
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = reset;
