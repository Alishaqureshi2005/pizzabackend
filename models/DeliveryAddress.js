const mongoose = require('mongoose');

const deliveryAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  apartment: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
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
  deliveryInstructions: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Ensure only one default address per user
deliveryAddressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.models.DeliveryAddress || mongoose.model('DeliveryAddress', deliveryAddressSchema); 