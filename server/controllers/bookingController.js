import { createBooking, getBookings } from '../services/bookingService.js';

/**
 * Create a booking
 */
export const createBookingController = async (req, res) => {
  try {
    const { buyer_id, listing_id } = req.body;

    // Basic validation
    if (!buyer_id || !listing_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: buyer_id, listing_id',
      });
    }

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(buyer_id) || !uuidRegex.test(listing_id)) {
      return res.status(400).json({
        success: false,
        error: 'buyer_id and listing_id must be valid UUIDs',
      });
    }

    // Call service
    const result = await createBooking(buyer_id, listing_id);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.status(201).json({ success: true, data: result.data });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get bookings for a user
 */
export const getBookingsController = async (req, res) => {
  try {
    const { buyer_id } = req.query;

    if (!buyer_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameter: buyer_id',
      });
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(buyer_id)) {
      return res.status(400).json({
        success: false,
        error: 'buyer_id must be a valid UUID',
      });
    }

    // Call service
    const result = await getBookings(buyer_id);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    res.json({ success: true, data: result.data });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};