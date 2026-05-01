import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API call functions
export const apiCalls = {
  // Get listings with optional filters
  getListings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
    if (filters.minKwh) params.append('min_kwh', filters.minKwh);
    return api.get(`/listings?${params}`);
  },

  // Create a new listing
  createListing: async (listingData) => {
    return api.post('/listings', listingData);
  },

  // Create a booking
  createBooking: async (bookingData) => {
    return api.post('/bookings', bookingData);
  },
};

export default api;