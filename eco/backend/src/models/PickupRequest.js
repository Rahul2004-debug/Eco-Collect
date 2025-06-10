const mongoose = require('mongoose');

const pickupRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: {
      type: String,
      required: true,
      enum: ['laptop', 'mobile', 'desktop', 'printer', 'monitor', 'other']
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    condition: {
      type: String,
      required: true,
      enum: ['working', 'not_working', 'damaged']
    },
    description: String
  }],
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  preferredDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedCollector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
pickupRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);

module.exports = PickupRequest; 