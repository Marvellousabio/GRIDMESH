import express from 'express';
import { initializePaymentController, paymentWebhookController } from '../controllers/paymentController.js';

const router = express.Router();

// Initialize payment
router.post('/init', initializePaymentController);

// Webhook for payment verification
router.post('/webhook', paymentWebhookController);

export default router;