import express from 'express';
import { createBookingController, getBookingsController } from '../controllers/bookingController.js';

const router = express.Router();

// Create a new booking
router.post('/', createBookingController);

// Get bookings for a user
router.get('/', getBookingsController);

export default router;