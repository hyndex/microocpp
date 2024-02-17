const _ = require('lodash');
const Authorize = require('./Authorize');
const BootNotification = require('./BootNotification');
const Heartbeat = require('./Heartbeat');
const MeterValues = require('./MeterValues');
const StartTransaction = require('./StartTransaction');
const StatusNotification = require('./StatusNotification');
const StopTransaction = require('./StopTransaction');

module.exports = cpid => {
  const handlers = {
    BootNotification,
    Heartbeat,
    StatusNotification,
    StartTransaction,
    StopTransaction,
    Authorize,
    MeterValues,
  };

  const finalHandlers = {};
  _.each(handlers, (handler, action) => {
    finalHandlers[action] = (...args) => handler(...args, cpid);
  });

  return finalHandlers;
};
