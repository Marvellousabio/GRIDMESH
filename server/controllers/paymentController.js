import { initializePayment, verifyPaymentWebhook } from '../services/paymentService.js';

/**
 * Initialize a payment
 */
export const initializePaymentController = async (req, res) => {
  try {
    const { booking_id, amount, currency, customer_email, customer_name, redirect_url } = req.body;

    // Basic validation
    if (!booking_id || !amount || !customer_email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: booking_id, amount, customer_email',
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number',
      });
    }

    // Call service
    const result = await initializePayment(req.body);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        mock: result.mock, // Provide mock fallback
      });
    }

    res.json({ success: true, data: result.data });
  } catch (err) {
    console.error('Error in payment initialization:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Handle Flutterwave webhook
 */
export const paymentWebhookController = async (req, res) => {
  try {
    const signature = req.headers['verif-hash'];
    const webhookData = req.body;

    console.log('Received webhook:', webhookData);

    // Call service
    const result = await verifyPaymentWebhook(webhookData, signature);

    if (!result.success) {
      console.error('Webhook verification failed:', result.error);
      return res.status(400).json({ success: false, error: result.error });
    }

    console.log('Webhook processed:', result.message);
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};