import express from 'express';
import { apiKeyAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file require API key authentication
router.use(apiKeyAuth);

// Example API routes for service-to-service communication
router.get('/status', (req, res) => {
  res.json({
    status: 'active',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Example endpoint that other services might need to access
router.post('/webhook', (req, res) => {
  // Process webhook data
  const { event, data } = req.body;
  console.log(`Received ${event} webhook:`, data);
  
  // Return acknowledgment
  res.json({ 
    received: true,
    message: 'Webhook processed successfully' 
  });
});

export default router;