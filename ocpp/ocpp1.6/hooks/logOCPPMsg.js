const msgIdToActionMap = new Map();

module.exports = (rawMsg, cpid, direction) => {
  let parsedMsg;
  try {
    parsedMsg = JSON.parse(rawMsg);
  } catch (error) {
    console.error('Failed to parse message:', error);
    return;
  }

  const [messageType, messageId, actionOrErrorCode] = parsedMsg;
  let action;

  // Using array destructuring to satisfy the ESLint 'prefer-destructuring' rule
  switch (messageType) {
    case 2: // CALL
      action = actionOrErrorCode;
      msgIdToActionMap.set(messageId, { action, cpid });
      break;
    case 3: // CALLRESULT
    case 4: // CALLERROR:
      {
        // Wrapping case block in curly braces to create a block-scoped lexical environment
        const entry = msgIdToActionMap.get(messageId);
        if (entry && entry.cpid === cpid) {
          action = entry.action;
          msgIdToActionMap.delete(messageId);
        } else {
          console.error('No matching CALL for messageId:', messageId);
        }
      }
      break;
    default:
      console.error('Unknown message type:', messageType);
      return;
  }

  console.log(`CPID: ${cpid}, Direction: ${direction}, ${rawMsg}`);
};
