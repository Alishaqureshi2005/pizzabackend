const mongoose = require('mongoose');

const deliveryAreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  zoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryZone',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  boundaries: {
    type: {
      type: String,
      enum: ['Polygon'],
      default: 'Polygon'
    },
    coordinates: {
      type: [[[Number]]], // Array of arrays of [longitude, latitude] points
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
deliveryAreaSchema.index({ boundaries: '2dsphere' });

// Method to check if a location is within this delivery area
deliveryAreaSchema.methods.isLocationInArea = function(location) {
  return this.boundaries.contains(location);
};

module.exports = mongoose.models.DeliveryArea || mongoose.model('DeliveryArea', deliveryAreaSchema); 