import { useState } from 'react';
import { apiCalls } from '../lib/api';

/**
 * Hook to create a new listing
 * @returns {Object} { createListing, loading, error }
 */
export const useCreateListing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createListing = async (listingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCalls.createListing(listingData);
      if (response.data.success) {
        return response.data.data; // Return the created listing
      } else {
        setError(response.data.error || 'Failed to create listing');
        return null;
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createListing, loading, error };
};