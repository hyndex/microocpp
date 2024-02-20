const _ = require('lodash');
const validateOCPP = require('../../schemas/validate'); // Adjust the path as needed

function MessageHandler(
  parser,
  sentCallsHandler,
  callHandler,
  sender,
  builders,
  hooks,
  currentVersion,
) {
  return function handler(message) {
    const parsed = parser(message);
    switch (parsed.type) {
      case 'CALL':
        return () => {
          const validationResult = validateOCPP(
            currentVersion,
            parsed.action,
            parsed.payload,
          );
          if (!validationResult) {
            console.error(
              `Invalid OCPP payload received for CALL ${parsed.action}: ${validationResult}`,
            );
            return _.noop;
          }

          const callResult = payload => {
            const message2send = _.invoke(
              builders,
              'callResult',
              parsed.id,
              payload,
            );
            hooks.execute(
              'sendCallRespond',
              () => {
                if (!_.isUndefined(message2send)) {
                  sender(message2send.message);
                }
              },
              { message2send },
            );
          };

          const callError = (code, description, details) => {
            const message2send = _.invoke(
              builders,
              'callError',
              parsed.id,
              code,
              description,
              details,
            );
            hooks.execute(
              'sendCallError',
              () => {
                if (!_.isUndefined(message2send)) {
                  sender(message2send.message);
                }
              },
              { message2send },
            );
          };

          return hooks.execute(
            'executeCallHandler',
            () =>
              callHandler(parsed.action, parsed.payload, {
                callResult,
                callError,
              }),
            {
              msg: parsed,
              res: { success: callResult, error: callError },
            },
          );
        };

      case 'CALLRESULT':
        return () => {
          const validationResult = validateOCPP(
            currentVersion,
            parsed.action,
            parsed.payload,
            true,
          );
          if (!validationResult) {
            console.error(
              `Invalid OCPP payload received for CALLRESULT of action ${parsed.action}: ${validationResult}`,
            );
            return _.noop;
          }

          return hooks.execute(
            'executeCallResultHandler',
            () => sentCallsHandler.success(parsed.id, parsed.payload),
            { msg: parsed },
          );
        };

      case 'CALLERROR':
        return () =>
          hooks.execute(
            'executeCallErrorHandler',
            () => sentCallsHandler.failure(parsed.id, parsed.payload),
            { msg: parsed },
          );

      default:
        return _.noop;
    }
  };
}

module.exports = MessageHandler;
