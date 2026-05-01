import { supabase } from '../config/supabaseClient.js';
import { broadcast } from '../websocket/server.js';

/**
 * Create a new energy listing
 * @param {Object} listingData - The listing data
 * @returns {Object} The created listing or error
 */
export const createListing = async (listingData) => {
  try {
    const { seller_id, kwh_available, price_per_kwh, time_slot } = listingData;

    // Insert into Supabase
    const { data, error } = await supabase
      .from('listings')
      .insert([
        {
          seller_id,
          kwh_available,
          price_per_kwh,
          time_slot: new Date(time_slot).toISOString(), // Ensure ISO format
          status: 'active', // Default status
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Broadcast new listing event
    broadcast('NEW_LISTING', data);

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Fetch active listings with optional filters
 * @param {Object} filters - Optional filters (max_price, min_kwh)
 * @returns {Object} Listings data or error
 */
export const getListings = async (filters = {}) => {
  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'active');

    // Apply filters
    if (filters.max_price !== undefined) {
      query = query.lte('price_per_kwh', filters.max_price);
    }

    if (filters.min_kwh !== undefined) {
      query = query.gte('kwh_available', filters.min_kwh);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};