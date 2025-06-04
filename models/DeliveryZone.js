const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Zone name is required'],
    trim: true
  },
  distance: {
    type: Number,
    required: [true, 'Distance in kilometers is required'],
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.DeliveryZone || mongoose.model('DeliveryZone', deliveryZoneSchema);