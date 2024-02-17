// routes.js
const express = require('express');
const remoteStartCharging = require('./RemoteStartTransaction');
const remoteStopCharging = require('./RemoteStopTransaction');
const reset = require('./Reset');
const getConfiguration = require('./GetConfiguration');
const unlockConnector = require('./UnlockConnector');
const changeAvailability = require('./ChangeAvailability');
const changeConfiguration = require('./ChangeConfiguration');
const updateFirmware = require('./UpdateFirmware');
const triggerMessage = require('./TriggerMessage');
const clearCache = require('./ClearCache');

const router = express.Router();

// Define routes and link them to their handlers
router.post('/remote-start-charging', remoteStartCharging);
router.post('/remote-stop-charging', remoteStopCharging);
router.post('/reset', reset);
router.post('/clear-cache', clearCache);
router.post('/get-configuration', getConfiguration);
router.post('/unlock-connector', unlockConnector);
router.post('/change-availability', changeAvailability);
router.post('/change-configuration', changeConfiguration);
router.post('/update-firmware', updateFirmware);
router.post('/trigger-message', triggerMessage);

module.exports = router;
