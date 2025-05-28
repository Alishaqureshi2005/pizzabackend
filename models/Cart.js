const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topping',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const cartItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large']
  },
  crust: {
    type: String,
    required: true,
    enum: ['classic', 'thin', 'thick', 'stuffed']
  },
  toppings: [toppingSchema],
  extraItems: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  specialInstructions: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
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

// Calculate total price before saving
cartSchema.pre('save', async function(next) {
  this.totalPrice = this.items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    return total + itemTotal;
  }, 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);