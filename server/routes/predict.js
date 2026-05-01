import express from 'express';
import { predictDemand } from '../services/aiService.js';

const router = express.Router();

// Get demand prediction
router.get('/', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required query parameters',
      });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude must be valid numbers',
      });
    }

    const prediction = await predictDemand(latNum, lngNum);

    res.json({ success: true, ...prediction });
  } catch (err) {
    console.error('Error in prediction route:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;