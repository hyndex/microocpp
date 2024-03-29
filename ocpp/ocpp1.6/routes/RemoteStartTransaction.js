const {
  generateUniqueTransactionId,
} = require('../../../utils/queue/generateTransactionId');
const { setChargerQueue } = require('../../../utils/queue/remoteStartQueue');
const connectedCps = require('../connectedCps');

/**
 * Initiates a remote start transaction for a charge point.
 *
 * This function generates a unique transaction ID, sets up a charger queue with the provided details,
 * and sends a 'RemoteStartTransaction' call to the specified charge point. If the charge point is not connected,
 * it responds with an error. Otherwise, it processes the command and returns the transaction details.
 *
 * @param {object} req - The request object containing the body with transaction details.
 * @param {object} res - The response object used to send back the HTTP response.
 * @param {string} req.body.cpid - The charge point identifier.
 * @param {string} req.body.idTag - The identifier tag for the user initiating the charge.
 * @param {number} [req.body.connectorId] - The optional connector ID on the charge point to be used.
 * @param {number} [req.body.limit] - The optional limit for the charging session (in kWh, time, etc.).
 * @param {string} [req.body.limitType] - The type of limit applied to the charging session (e.g., 'KWH', 'TIME').
 *
 * @returns Sends a response with the transaction status and details, or an error message if the charge point is not connected.
 */
async function remoteStartTransaction(req, res) {
  try {
    const { cpid, idTag, connectorId, limit, limitType } = req.body; // connectorId is optional

    const txnId = await generateUniqueTransactionId();

    setChargerQueue(cpid, {
      txnId,
      connector: connectorId,
      idTag,
      limit,
      limitType,
    });

    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    device
      .sendCall('RemoteStartTransaction', { connectorId, idTag })
      .then(response => {
        response.transactionId = txnId;
        res.status(200).send({
          status: 'Accepted',
          message: 'Remote start transaction command processed.',
          transactionId: response.transactionId,
          details: response,
        });
      })
      .catch(error => {
        console.error(
          `Error sending RemoteStartTransaction to ${cpid}:`,
          error,
        );
        res.status(500).send({
          status: 'Error',
          message: 'Error sending command to charger.',
        });
      });
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in RemoteStartTransaction for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = remoteStartTransaction;
