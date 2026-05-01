import Flutterwave from 'flutterwave-node-v3';
import { supabase } from '../config/supabaseClient.js';

// Initialize Flutterwave
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);

/**
 * Initialize a payment with Flutterwave
 * @param {Object} paymentData - Payment details
 * @returns {Object} Payment link or error
 */
export const initializePayment = async (paymentData) => {
  try {
    const { booking_id, amount, currency = 'NGN', customer_email, customer_name, redirect_url } = paymentData;

    // For hackathon/demo: mock payment if enabled
    if (process.env.MOCK_PAYMENTS === 'true') {
      return {
        success: true,
        data: {
          link: `${process.env.VITE_API_BASE_URL || 'http://localhost:5000'}/mock-payment?booking_id=${booking_id}&amount=${amount}`,
          tx_ref: `mock_tx_${booking_id}_${Date.now()}`,
        },
      };
    }

    const payload = {
      tx_ref: `gridmesh_booking_${booking_id}_${Date.now()}`,
      amount,
      currency,
      redirect_url: redirect_url || `${process.env.VITE_API_BASE_URL || 'http://localhost:5000'}/payment-success`,
      customer: {
        email: customer_email,
        name: customer_name || 'GridMesh User',
      },
      customizations: {
        title: 'GridMesh Energy Payment',
        description: `Payment for booking ${booking_id}`,
      },
    };

    const response = await flw.Payment.create(payload);

    if (response.status === 'success') {
      return { success: true, data: response.data };
    } else {
      throw new Error('Payment initialization failed');
    }
  } catch (err) {
    console.error('Error initializing payment:', err);
    // Fallback to mock
    return {
      success: false,
      error: err.message,
      mock: {
        link: `http://localhost:5000/mock-payment?booking_id=${paymentData.booking_id}&amount=${paymentData.amount}`,
        tx_ref: `fallback_tx_${paymentData.booking_id}_${Date.now()}`,
      },
    };
  }
};

/**
 * Verify and process webhook from Flutterwave
 * @param {Object} webhookData - Webhook payload
 * @param {string} signature - Webhook signature
 * @returns {Object} Verification result
 */
export const verifyPaymentWebhook = async (webhookData, signature) => {
  try {
    // Verify webhook signature
    const expectedSignature = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }

    const { event, data } = webhookData;

    if (event !== 'charge.completed') {
      return { success: true, message: 'Event not charge.completed, ignoring' };
    }

    const { tx_ref, status, amount } = data;

    // For hackathon: handle mock payments
    if (tx_ref.startsWith('mock_tx_') || tx_ref.startsWith('fallback_tx_')) {
      // Extract booking_id from tx_ref
      const bookingId = tx_ref.split('_')[2];
      await updateBookingStatus(bookingId, 'paid');
      return { success: true, message: 'Mock payment processed' };
    }

    if (status !== 'successful') {
      return { success: true, message: 'Payment not successful' };
    }

    // Extract booking_id from tx_ref (format: gridmesh_booking_{booking_id}_{timestamp})
    const parts = tx_ref.split('_');
    if (parts.length < 3 || parts[0] !== 'gridmesh' || parts[1] !== 'booking') {
      throw new Error('Invalid tx_ref format');
    }
    const bookingId = parts[2];

    // Update booking status
    await updateBookingStatus(bookingId, 'paid');

    return { success: true, message: 'Payment verified and booking updated' };
  } catch (err) {
    console.error('Error verifying payment:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Update booking status in database
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 */
const updateBookingStatus = async (bookingId, status) => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) {
    throw new Error(`Failed to update booking: ${error.message}`);
  }
};