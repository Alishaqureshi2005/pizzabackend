const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['meat', 'vegetable', 'cheese', 'herb', 'seafood'],
    required: true
  },
  image: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  calories: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Topping', toppingSchema); 