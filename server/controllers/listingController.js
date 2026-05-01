import { createListing, getListings } from '../services/listingService.js';

/**
 * Create a new listing
 */
export const createListingController = async (req, res) => {
  try {
    const { seller_id, kwh_available, price_per_kwh, time_slot } = req.body;

    // Basic validation
    if (!seller_id || !kwh_available || !price_per_kwh || !time_slot) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: seller_id, kwh_available, price_per_kwh, time_slot',
      });
    }

    if (typeof kwh_available !== 'number' || kwh_available <= 0) {
      return res.status(400).json({
        success: false,
        error: 'kwh_available must be a positive number',
      });
    }

    if (typeof price_per_kwh !== 'number' || price_per_kwh <= 0) {
      return res.status(400).json({
        success: false,
        error: 'price_per_kwh must be a positive number',
      });
    }

    if (isNaN(Date.parse(time_slot))) {
      return res.status(400).json({
        success: false,
        error: 'time_slot must be a valid date',
      });
    }

    // Call service
    const result = await createListing(req.body);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    res.status(201).json({ success: true, data: result.data });
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

/**
 * Get active listings with optional filters
 */
export const getListingsController = async (req, res) => {
  try {
    const { max_price, min_kwh } = req.query;

    // Parse and validate filters
    const filters = {};
    if (max_price !== undefined) {
      const price = parseFloat(max_price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          error: 'max_price must be a non-negative number',
        });
      }
      filters.max_price = price;
    }

    if (min_kwh !== undefined) {
      const kwh = parseFloat(min_kwh);
      if (isNaN(kwh) || kwh < 0) {
        return res.status(400).json({
          success: false,
          error: 'min_kwh must be a non-negative number',
        });
      }
      filters.min_kwh = kwh;
    }

    // Call service
    const result = await getListings(filters);

    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }

    res.json({ success: true, data: result.data });
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};