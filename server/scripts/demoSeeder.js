import { supabase } from '../config/supabaseClient.js';
import { broadcast } from '../websocket/server.js';
import { predictDemand } from '../services/aiService.js';

/**
 * Demo seeder for GridMesh - creates fake data to make the app look alive
 */

// Fake data generators
const sellers = [
  { email: 'demo_seller1@gridmesh.com', lat: 6.5244, lng: 3.3792, name: 'Lagos Seller' },
  { email: 'demo_seller2@gridmesh.com', lat: 7.3775, lng: 3.9470, name: 'Ibadan Seller' },
  { email: 'demo_seller3@gridmesh.com', lat: 9.0765, lng: 8.6753, name: 'Abuja Seller' },
];

const buyers = [
  { email: 'demo_buyer1@gridmesh.com', name: 'Lagos Buyer' },
  { email: 'demo_buyer2@gridmesh.com', name: 'Ibadan Buyer' },
  { email: 'demo_buyer3@gridmesh.com', name: 'Abuja Buyer' },
];

/**
 * Generate a random listing
 */
const generateFakeListing = () => {
  const seller = sellers[Math.floor(Math.random() * sellers.length)];
  const kwh = Math.floor(Math.random() * 100) + 10; // 10-110 kWh
  const price = (Math.random() * 0.1 + 0.05).toFixed(2); // 0.05-0.15 $/kWh
  const timeSlot = new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000); // Next 24 hours

  return {
    seller_id: 'demo_' + seller.email.split('@')[0],
    seller_lat: seller.lat,
    seller_lng: seller.lng,
    kwh_available: kwh,
    price_per_kwh: parseFloat(price),
    time_slot: timeSlot.toISOString(),
    status: 'active',
  };
};

/**
 * Generate a random booking
 */
const generateFakeBooking = async () => {
  try {
    // Get active listings
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .limit(5);

    if (error || !listings || listings.length === 0) return null;

    const listing = listings[Math.floor(Math.random() * listings.length)];
    const buyer = buyers[Math.floor(Math.random() * buyers.length)];

    return {
      buyer_id: 'demo_' + buyer.email.split('@')[0],
      listing_id: listing.id,
      total_price: listing.kwh_available * listing.price_per_kwh,
      status: 'pending',
    };
  } catch (err) {
    console.error('Error getting listings for booking:', err);
    return null;
  }
};

/**
 * Auto-generate listings
 */
const autoGenerateListings = async () => {
  try {
    const listing = generateFakeListing();
    const { data, error } = await supabase
      .from('listings')
      .insert([listing])
      .select()
      .single();

    if (error) {
      console.error('Error creating demo listing:', error);
      return;
    }

    console.log('Demo listing created:', data.id);
    broadcast('NEW_LISTING', data);
  } catch (err) {
    console.error('Error in auto-generate listings:', err);
  }
};

/**
 * Auto-create bookings
 */
const autoCreateBookings = async () => {
  try {
    const bookingData = await generateFakeBooking();
    if (!bookingData) return;

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating demo booking:', bookingError);
      return;
    }

    // Update listing status
    await supabase
      .from('listings')
      .update({ status: 'booked' })
      .eq('id', bookingData.listing_id);

    console.log('Demo booking created:', booking.id);
    broadcast('NEW_BOOKING', booking);
  } catch (err) {
    console.error('Error in auto-create bookings:', err);
  }
};

/**
 * Simulate AI predictions
 */
const simulateAIPredictions = async () => {
  try {
    // Pick a random location
    const locations = [
      { lat: 6.5244, lng: 3.3792 }, // Lagos
      { lat: 7.3775, lng: 3.9470 }, // Ibadan
      { lat: 9.0765, lng: 8.6753 }, // Abuja
    ];
    const location = locations[Math.floor(Math.random() * locations.length)];

    const prediction = await predictDemand(location.lat, location.lng);

    console.log('Demo AI prediction:', {
      location: `${location.lat}, ${location.lng}`,
      demand_score: prediction.demand_score,
      suggested_price: prediction.suggested_price_per_kwh,
    });

    // Broadcast prediction updates
    broadcast('AI_PREDICTION', {
      location,
      ...prediction,
    });
  } catch (err) {
    console.error('Error in AI prediction simulation:', err);
  }
};

/**
 * Start demo mode
 */
export const startDemoMode = () => {
  console.log('Starting GridMesh Demo Mode...');

  // Auto-generate listings every 15 seconds
  const listingInterval = setInterval(autoGenerateListings, 15000);

  // Auto-create bookings every 30 seconds
  const bookingInterval = setInterval(autoCreateBookings, 30000);

  // Simulate AI predictions every 45 seconds
  const aiInterval = setInterval(simulateAIPredictions, 45000);

  // Initial run
  setTimeout(autoGenerateListings, 1000);
  setTimeout(simulateAIPredictions, 2000);

  // Return cleanup function
  return () => {
    clearInterval(listingInterval);
    clearInterval(bookingInterval);
    clearInterval(aiInterval);
    console.log('Demo mode stopped');
  };
};