const mongoose = require('mongoose');

// Schema for size options
const sizeOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

// Schema for crust options
const crustOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['classic', 'thin', 'thick', 'stuffed']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

// Schema for customization options
const customizationSchema = new mongoose.Schema({
  sizes: [sizeOptionSchema],
  crusts: [crustOptionSchema],
  maxToppings: {
    type: Number,
    default: 5
  },
  maxExtraItems: {
    type: Number,
    default: 3
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Product image is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  basePrice: {
    type: Number,
    required: [true, 'Product base price is required'],
    min: 0
  },
  countInStock: {
    type: Number,
    required: [true, 'Product stock count is required'],
    min: 0,
    default: 0
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
  isActive: {
    type: Boolean,
    default: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  ingredients: [{
    type: String,
    required: true
  }],
  customization: {
    type: customizationSchema,
    required: true
  },
  defaultToppings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topping'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema); 