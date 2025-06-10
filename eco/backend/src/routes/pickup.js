const express = require('express');
const router = express.Router();
const PickupRequest = require('../models/PickupRequest');

// Create new pickup request
router.post('/', async (req, res) => {
  try {
    const { userId, items, pickupAddress, preferredDate } = req.body;
    
    // Validate required fields
    if (!userId || !items || !pickupAddress || !preferredDate) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['userId', 'items', 'pickupAddress', 'preferredDate']
      });
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items must be a non-empty array' });
    }

    const pickupRequest = new PickupRequest({
      user: userId,
      items: items.map(item => ({
        type: item.type,
        quantity: item.quantity,
        condition: item.condition,
        description: item.description || ''
      })),
      pickupAddress: {
        street: pickupAddress.street || '',
        city: pickupAddress.city || '',
        state: pickupAddress.state || '',
        zipCode: pickupAddress.zipCode || ''
      },
      preferredDate: new Date(preferredDate)
    });

    await pickupRequest.save();

    res.status(201).json({
      message: 'Pickup request created successfully',
      pickupRequest
    });
  } catch (error) {
    console.error('Pickup request error:', error);
    res.status(500).json({ 
      message: 'Error creating pickup request', 
      error: error.message,
      details: error.errors
    });
  }
});

// Get user's pickup requests
router.get('/my-requests', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const pickupRequests = await PickupRequest.find({ user: userId })
      .sort({ createdAt: -1 });
    
    res.json(pickupRequests);
  } catch (error) {
    console.error('Fetch pickup requests error:', error);
    res.status(500).json({ message: 'Error fetching pickup requests', error: error.message });
  }
});

// Get single pickup request
router.get('/:id', async (req, res) => {
  try {
    const pickupRequest = await PickupRequest.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email phone');

    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    res.json(pickupRequest);
  } catch (error) {
    console.error('Fetch pickup request error:', error);
    res.status(500).json({ message: 'Error fetching pickup request', error: error.message });
  }
});

// Update pickup request status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, assignedCollector, notes } = req.body;
    
    const pickupRequest = await PickupRequest.findById(req.params.id);
    if (!pickupRequest) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    pickupRequest.status = status;
    if (assignedCollector) pickupRequest.assignedCollector = assignedCollector;
    if (notes) pickupRequest.notes = notes;

    await pickupRequest.save();

    res.json({
      message: 'Pickup request status updated successfully',
      pickupRequest
    });
  } catch (error) {
    console.error('Update pickup request error:', error);
    res.status(500).json({ message: 'Error updating pickup request', error: error.message });
  }
});

module.exports = router; 