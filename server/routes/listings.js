import express from 'express';
import { createListingController, getListingsController } from '../controllers/listingController.js';

const router = express.Router();

// Create a new listing
router.post('/', createListingController);

// Get active listings with optional filters
router.get('/', getListingsController);

export default router;