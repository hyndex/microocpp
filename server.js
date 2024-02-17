require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const helmet = require('helmet');

// Module imports
const { parseInt } = require('lodash');
const cron = require('cron');
const ocppRoutes = require('./ocpp/ocpp1.6/routes');
const connectedCps = require('./ocpp/ocpp1.6/connectedCps');
const callHandlersConfig = require('./ocpp/ocpp1.6/callHandlers');
const logOCPPMsg = require('./ocpp/ocpp1.6/hooks/logOCPPMsg');
const { getCharger } = require('./ocpp/ocpp1.6/globalDBUtils');
const OCPPTaskManager = require('./ocpp/ocpp1.6/OCPPTaskManager');
const {
  checkForMeterValueTimeout,
} = require('./utils/cron/checkForMeterValueTimeout');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });
const supportedOcppVersionsByCsms = ['ocpp1.6', 'ocpp1.6j'];

app.use(helmet());
app.use(express.json());
app.use('/ocpp', ocppRoutes);

const setupHooks = (device, cpid) => {
  device.hooks.after('messageReceived', ({ rawMsg }) => {
    logOCPPMsg(rawMsg, cpid, 'incoming');
  });

  device.hooks.after('sendWsMsg', ({ rawMsg }) => {
    logOCPPMsg(rawMsg, cpid, 'outgoing');
  });
};

const setupConnection = (ws, cpid, selectedOcppVersion) => {
  const callHandlers = callHandlersConfig(cpid);

  const device = new OCPPTaskManager({
    sender: message => ws.send(message),
    callHandlers,
  });

  device.connected(selectedOcppVersion);
  connectedCps.put(cpid, { ...device, ws });

  ws.on('message', message => {
    device.received(message);
  });

  ws.on('close', () => {
    console.log(`Connection with CPID ${cpid} closed.`);
    device.disconnected();
    connectedCps.remove(cpid);
  });

  setupHooks(device, cpid);

  // Ping-pong mechanism with maximum pong fails
  let pongFailCount = 0;
  const maxPongFails = parseInt(process.env.WEB_SOCKET_MAX_PONG_FAILS || '3');
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      if (pongFailCount < maxPongFails) {
        ws.ping();
        pongFailCount += 1;
      } else {
        ws.terminate();
        clearInterval(pingInterval);
        console.log(
          `Connection with CPID ${cpid} closed due to ${maxPongFails} consecutive pong failures`,
        );
        connectedCps.remove(cpid);
      }
    }
  }, process.env.WEB_SOCKET_PING_INTERVAL || 10000);

  ws.on('pong', () => {
    pongFailCount = 0; // Reset the counter on receiving a pong
  });
};

server.on('upgrade', async (request, socket, head) => {
  const { pathname } = new URL(request.url, `http://${request.headers.host}`);
  const cpid = pathname.split('/').pop();
  const protocols = 'ocpp1.6j'; // request.headers['sec-websocket-protocol'];
  const selectedOcppVersion =
    protocols &&
    protocols
      .split(',')
      .map(p => p.trim())
      .find(p => supportedOcppVersionsByCsms.includes(p));

  if (!selectedOcppVersion || !cpid) {
    console.log(
      'Chargepoint Id is empty or unsupported OCPP version, destroying the incoming websocket connection...',
    );
    socket.destroy();
    return;
  }

  if (connectedCps.get(cpid)) {
    console.log(
      `Replacing the current connection for CPID ${cpid} with a new one...`,
    );
    const foundCp = connectedCps.get(cpid);
    connectedCps.remove(cpid); // Corrected line
    foundCp.ws.terminate();
  }

  const charger = await getCharger(cpid);
  if (!(charger && charger?.enabled)) {
    console.log(
      'Charger not found or the charger is not enabled, destroying the incoming websocket connection...',
    );
    return socket.destroy();
  }

  wss.handleUpgrade(request, socket, head, ws => {
    console.log(`WebSocket connection upgrade started for CPID: ${cpid}`);
    setupConnection(ws, cpid, selectedOcppVersion);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));

// const { migrate } = require('./migrate');

// migrate();

// Set up a cron job to run every minute
const checkMeterValueTimeoutJob = new cron.CronJob('0 * * * * *', async () => {
  console.log('Checking for meter value timeouts...');
  await checkForMeterValueTimeout();
});

// Start the cron job
checkMeterValueTimeoutJob.start();

console.log('Cron job for checking meter value timeouts has been started.');
