const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PickupRequest = require('../models/PickupRequest');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Get all pickup requests
router.get('/requests', auth, isAdmin, async (req, res) => {
  try {
    const requests = await PickupRequest.find()
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching pickup requests', error: error.message });
  }
});

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user role
router.patch('/users/:id/role', auth, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const [totalRequests, completedRequests, pendingRequests, totalUsers] = await Promise.all([
      PickupRequest.countDocuments(),
      PickupRequest.countDocuments({ status: 'completed' }),
      PickupRequest.countDocuments({ status: 'pending' }),
      User.countDocuments()
    ]);
    
    res.json({
      totalRequests,
      completedRequests,
      pendingRequests,
      totalUsers
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Update pickup request status
router.put('/requests/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await PickupRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    // Return updated request with populated fields
    const updatedRequest = await PickupRequest.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email phone');

    res.json({ 
      message: 'Request status updated successfully', 
      request: updatedRequest 
    });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Error updating request status', error: error.message });
  }
});

// Get single pickup request
router.get('/requests/:id', auth, isAdmin, async (req, res) => {
  try {
    const request = await PickupRequest.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedCollector', 'name email phone');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Fetch Request Error:', error);
    res.status(500).json({ message: 'Error fetching request details', error: error.message });
  }
});

module.exports = router;

const AdminDashboard = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add to handleStatusUpdate
  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      await axios.put(
        `http://localhost:5000/api/requests/${requestId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state...
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request status');
    } finally {
      setIsSubmitting(false);
    }
  };
};