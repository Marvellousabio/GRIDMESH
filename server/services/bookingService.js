import { supabase } from '../config/supabaseClient.js';
import { broadcast } from '../websocket/server.js';

/**
 * Create a booking for a listing
 * @param {string} buyerId - The buyer's ID
 * @param {string} listingId - The listing ID
 * @returns {Object} The created booking or error
 */
export const createBooking = async (buyerId, listingId) => {
  try {
    // Fetch the listing to check availability and calculate price
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      throw new Error('Listing not found');
    }

    if (listing.status !== 'active') {
      throw new Error('Listing is not available for booking');
    }

    // Calculate total price
    const totalPrice = listing.kwh_available * listing.price_per_kwh;

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          buyer_id: buyerId,
          listing_id: listingId,
          total_price: totalPrice,
          status: 'pending', // Default status
        },
      ])
      .select()
      .single();

    if (bookingError) {
      throw new Error(bookingError.message);
    }

    // Update listing status to 'booked'
    const { error: updateError } = await supabase
      .from('listings')
      .update({ status: 'booked' })
      .eq('id', listingId);

    if (updateError) {
      // If update fails, consider rolling back the booking
      // For simplicity, log error and proceed (in production, use transactions)
      console.error('Failed to update listing status:', updateError);
    }

    // Broadcast new booking event
    broadcast('NEW_BOOKING', booking);

    return { success: true, data: booking };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Fetch all bookings for a user
 * @param {string} buyerId - The buyer's ID
 * @returns {Object} Bookings data or error
 */
export const getBookings = async (buyerId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('buyer_id', buyerId);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};