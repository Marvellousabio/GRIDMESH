import { useState } from 'react';
import { apiCalls } from '../lib/api';

/**
 * Hook to create a booking
 * @returns {Object} { createBooking, loading, error }
 */
export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCalls.createBooking(bookingData);
      if (response.data.success) {
        return response.data.data; // Return the created booking
      } else {
        setError(response.data.error || 'Failed to create booking');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};