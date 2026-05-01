import express from 'express';
import cors from 'cors';
import './config/env.js';
import healthRouter from './routes/health.js';
import listingsRouter from './routes/listings.js';
import bookingsRouter from './routes/bookings.js';
import predictRouter from './routes/predict.js';
import paymentsRouter from './routes/payments.js';
import { initWebSocket } from './websocket/server.js';
import { startDemoMode } from './scripts/demoSeeder.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', healthRouter);
app.use('/listings', listingsRouter);
app.use('/bookings', bookingsRouter);
app.use('/predict-demand', predictRouter);
app.use('/payments', paymentsRouter);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`GridMesh server running on port ${PORT}`);
});

// Initialize WebSocket server
initWebSocket(server);

// Start demo mode if enabled
if (process.env.DEMO_MODE === 'true') {
  startDemoMode();
}