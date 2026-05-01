import WebSocket from 'ws';

let wss;

/**
 * Initialize WebSocket server
 * @param {Object} server - HTTP server instance
 */
export const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      console.log('Received message:', message.toString());
      // Handle incoming messages if needed
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('WebSocket server initialized');
};

/**
 * Broadcast message to all connected clients
 * @param {string} type - Message type
 * @param {Object} data - Message data
 */
export const broadcast = (type, data) => {
  if (wss) {
    const message = JSON.stringify({
      type,
      data,
      timestamp: new Date().toISOString()
    });

    let clientCount = 0;
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
        clientCount++;
      }
    });

    console.log(`Broadcasted ${type} to ${clientCount} clients`);
  }
};