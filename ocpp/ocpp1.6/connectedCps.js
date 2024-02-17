// Initialize a Map to hold the charge point connections
const connectedCps = new Map();

/**
 * Retrieves a charge point connection from the map.
 *
 * @param {string} cpid - The charge point identifier.
 * @returns The charge point connection if found, otherwise undefined.
 */
function get(cpid) {
  return connectedCps.get(cpid);
}

/**
 * Adds or updates a charge point connection in the map.
 *
 * @param {string} cpid - The charge point identifier.
 * @param {WebSocket} cpConnection - The charge point's WebSocket connection.
 */
function put(cpid, cpConnection) {
  connectedCps.set(cpid, cpConnection);
}

/**
 * Deletes a charge point connection from the map.
 *
 * @param {string} cpid - The charge point identifier.
 */
function remove(cpid) {
  connectedCps.delete(cpid);
}

/**
 * Retrieves all charge point connections.
 *
 * @returns An iterable of [cpid, cpConnection] pairs.
 */
function getAll() {
  return connectedCps.entries();
}

module.exports = {
  get,
  put,
  remove,
  getAll,
};
