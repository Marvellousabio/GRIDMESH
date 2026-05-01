import { useState, useEffect } from 'react';
import { apiCalls } from '../lib/api';

/**
 * Hook to fetch listings with optional filters
 * @param {Object} filters - Optional filters (maxPrice, minKwh)
 * @returns {Object} { listings, loading, error, refetch }
 */
export const useListings = (filters = {}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCalls.getListings(filters);
      if (response.data.success) {
        setListings(response.data.data);
      } else {
        setError(response.data.error || 'Failed to fetch listings');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [JSON.stringify(filters)]); // Refetch when filters change

  const refetch = () => fetchListings();

  return { listings, loading, error, refetch };
};