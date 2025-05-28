const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  maxOrders: {
    type: Number,
    default: 5
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentOrders: {
    type: Number,
    default: 0
  }
});

const operatingHoursSchema = new mongoose.Schema({
  monday: { open: String, close: String },
  tuesday: { open: String, close: String },
  wednesday: { open: String, close: String },
  thursday: { open: String, close: String },
  friday: { open: String, close: String },
  saturday: { open: String, close: String },
  sunday: { open: String, close: String }
});

const deliveryZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Zone name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Zone description is required'],
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
  radius: {
    type: Number,
    required: [true, 'Radius in kilometers is required'],
    min: 0
  },
  baseDeliveryFee: {
    type: Number,
    required: [true, 'Base delivery fee is required'],
    min: 0
  },
  minimumOrderAmount: {
    type: Number,
    required: [true, 'Minimum order amount is required'],
    min: 0
  },
  maximumDeliveryTime: {
    type: Number,
    required: [true, 'Maximum delivery time in minutes is required'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  timeSlots: [timeSlotSchema],
  operatingHours: {
    type: operatingHoursSchema,
    required: [true, 'Operating hours are required'],
    default: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:00' }
    }
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
deliveryZoneSchema.index({ 'coordinates': '2dsphere' });

// Method to check if a location is within the delivery zone
deliveryZoneSchema.methods.isLocationInZone = function(latitude, longitude) {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = this.coordinates.latitude * Math.PI / 180;
  const lat2 = latitude * Math.PI / 180;
  const deltaLat = (latitude - this.coordinates.latitude) * Math.PI / 180;
  const deltaLon = (longitude - this.coordinates.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
           Math.cos(lat1) * Math.cos(lat2) *
           Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance <= this.radius;
};

// Calculate delivery fee based on distance
deliveryZoneSchema.methods.calculateDeliveryFee = function(latitude, longitude) {
  const R = 6371;
  const lat1 = this.coordinates.latitude * Math.PI / 180;
  const lat2 = latitude * Math.PI / 180;
  const deltaLat = (latitude - this.coordinates.latitude) * Math.PI / 180;
  const deltaLon = (longitude - this.coordinates.longitude) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
           Math.cos(lat1) * Math.cos(lat2) *
           Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Additional fee per km after base radius
  const additionalFeePerKm = 20; // PKR 20 per additional km
  let additionalDistance = Math.max(0, distance - this.radius);
  let additionalFee = Math.round(additionalDistance * additionalFeePerKm);

  return this.baseDeliveryFee + additionalFee;
};

// Get available time slots for a specific day
deliveryZoneSchema.methods.getAvailableSlots = function(day) {
  if (!this.operatingHours || !this.operatingHours[day.toLowerCase()]) {
    return [];
  }

  const hours = this.operatingHours[day.toLowerCase()];
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // If no time slots are defined, generate them
  if (!this.timeSlots || this.timeSlots.length === 0) {
    const slots = [];
    const [openHour] = hours.open.split(':').map(Number);
    const [closeHour] = hours.close.split(':').map(Number);

    for (let hour = openHour; hour < closeHour; hour++) {
      slots.push({
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        maxOrders: 5,
        isAvailable: true,
        currentOrders: 0
      });
    }
    return slots;
  }

  // Filter available slots based on current time
  return this.timeSlots.filter(slot => {
    const [slotHour, slotMinute] = slot.startTime.split(':').map(Number);
    
    // Only show future time slots
    if (slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute)) {
      return false;
    }

    return slot.isAvailable && slot.currentOrders < slot.maxOrders;
  });
};

module.exports = mongoose.models.DeliveryZone || mongoose.model('DeliveryZone', deliveryZoneSchema);