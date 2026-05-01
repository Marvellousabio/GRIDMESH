/**
 * Simple matching engine for GridMesh
 * Finds the best listing for a buyer based on criteria
 */

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Find the best listing for a buyer
 * @param {Array} listings - Array of listing objects (assumed to include seller_lat, seller_lng)
 * @param {Object} userLocation - User's location {lat, lng} (optional)
 * @returns {Object} {bestListing, explanation}
 */
export const findBestListing = (listings, userLocation = null) => {
  // Filter active listings
  const activeListings = listings.filter(listing => listing.status === 'active');

  if (activeListings.length === 0) {
    return {
      bestListing: null,
      explanation: 'No active listings available'
    };
  }

  // Sort by price (lowest first)
  activeListings.sort((a, b) => a.price_per_kwh - b.price_per_kwh);

  // Get the cheapest
  let bestListing = activeListings[0];

  let explanation = `Selected due to lowest price of $${bestListing.price_per_kwh}/kWh among ${activeListings.length} active listings.`;

  // If multiple with same price and userLocation provided, choose closest
  if (userLocation && bestListing.seller_lat && bestListing.seller_lng) {
    const samePriceListings = activeListings.filter(l => l.price_per_kwh === bestListing.price_per_kwh);

    if (samePriceListings.length > 1) {
      samePriceListings.forEach(listing => {
        listing.distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          listing.seller_lat, listing.seller_lng
        );
      });

      samePriceListings.sort((a, b) => a.distance - b.distance);
      bestListing = samePriceListings[0];

      explanation += ` Among listings with the same price, selected the closest (${bestListing.distance.toFixed(2)} km away).`;
    }
  }

  return {
    bestListing,
    explanation
  };
};