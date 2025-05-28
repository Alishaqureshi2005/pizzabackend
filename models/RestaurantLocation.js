const mongoose = require('mongoose');

const restaurantLocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  branchName: {
    type: String,
    required: [true, 'Branch name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deliveryZones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryZone'
  }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
restaurantLocationSchema.index({ 'coordinates': '2dsphere' });

// Method to calculate distance to a delivery location
restaurantLocationSchema.methods.calculateDistanceTo = function(latitude, longitude) {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = this.coordinates.latitude * Math.PI / 180;
  const lat2 = latitude * Math.PI / 180;
  const deltaLat = (latitude - this.coordinates.latitude) * Math.PI / 180;
  const deltaLon = (longitude - this.coordinates.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
           Math.cos(lat1) * Math.cos(lat2) *
           Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c; // Returns distance in kilometers
};

// Method to check if restaurant is currently open
restaurantLocationSchema.methods.isOpen = function() {
  const now = new Date();
  const day = now.toLocaleLowerCase();
  const time = now.toLocaleTimeString('en-US', { hour12: false });
  
  const hours = this.operatingHours[day];
  if (!hours) return false;

  return time >= hours.open && time <= hours.close;
};

module.exports = mongoose.models.RestaurantLocation || mongoose.model('RestaurantLocation', restaurantLocationSchema); 