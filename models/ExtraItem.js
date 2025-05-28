const mongoose = require('mongoose');

const extraItemSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['topping', 'extra', 'sauce', 'side'],
    required: true
  },
  // For toppings specific properties
  toppingType: {
    type: String,
    enum: ['meat', 'vegetable', 'cheese', 'herb'],
    required: function() {
      return this.category === 'topping';
    }
  },
  // For extras specific properties
  extraType: {
    type: String,
    enum: ['dip', 'drink', 'dessert', 'salad'],
    required: function() {
      return this.category === 'extra';
    }
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.ExtraItem || mongoose.model('ExtraItem', extraItemSchema); 