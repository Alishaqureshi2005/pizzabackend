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

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  customization: {
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    toppings: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topping'
      },
      name: String,
      price: Number,
      quantity: Number
    }],
    specialInstructions: String
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  orderType: {
    type: String,
    required: true,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  deliveryAddress: {
    street: {
      type: String,
      required: function() {
        return this.orderType === 'delivery';
      }
    },
    city: {
      type: String,
      required: function() {
        return this.orderType === 'delivery';
      }
    },
    postalCode: {
      type: String,
      required: function() {
        return this.orderType === 'delivery';
      }
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    deliveryInstructions: String
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  deliveryZone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryZone'
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  isOutOfZone: {
    type: Boolean,
    default: false
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  notes: String,
  cancellationReason: String
}, {
  timestamps: true
});

// Calculate final price before saving
orderSchema.pre('save', function(next) {
  this.finalPrice = this.totalPrice + this.deliveryCharge + this.tax - this.discount;
  next();
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema); 