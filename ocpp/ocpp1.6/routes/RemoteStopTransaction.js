const connectedCps = require('../connectedCps');

/**
 * Initiates a remote stop transaction to terminate an ongoing charging session.
 *
 * @param {Object} req - The request object from Express.js containing the HTTP request data.
 * @param {Object} req.body - The body of the request containing the transaction details.
 * @param {string} req.body.cpid - The Charge Point Identifier for which the remote stop transaction is initiated.
 * @param {number} req.body.transactionId - The unique identifier of the charging session to be stopped.
 * @param {Object} res - The response object from Express.js used to send back the HTTP response.
 * @returns {void} Sends a response to the client with the stop transaction status.
 */

function remoteStopTransaction(req, res) {
  try {
    const { cpid, transactionId } = req.body;
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    device
      .sendCall('RemoteStopTransaction', { transactionId })
      .then(response => {
        res.status(200).send({
          status: 'Accepted',
          message: 'Remote stop transaction command processed.',
          details: response,
        });
      })
      .catch(error => {
        console.error(`Error sending RemoteStopTransaction to ${cpid}:`, error);
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in RemoteStopTransaction for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = remoteStopTransaction;
