const connectedCps = require('../connectedCps');

function clearCache(req, res) {
  try {
    const { cpid } = req.body;
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    device
      .sendCall('ClearCache', {})
      .then(response => {
        res.status(200).json({
          status: 'Accepted',
          message: 'Clear cache command processed.',
          details: response,
        });
      })
      .catch(error => {
        console.error(`Error sending ClearCache to ${cpid}:`, error);
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
          data: error,
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in ClearCache for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = clearCache;
