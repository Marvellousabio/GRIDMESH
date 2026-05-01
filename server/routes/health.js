import express from 'express';

const router = express.Router();

// Health check route
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GridMesh API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;