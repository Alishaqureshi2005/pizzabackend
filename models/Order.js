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
      required: true,
      enum: ['small', 'medium', 'large']
    },
    crust: {
      type: String,
      required: true,
      enum: ['classic', 'thin', 'thick', 'stuffed']
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
    extraItems: [{
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExtraItem'
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
    apartment: String,
    city: {
      type: String,
      required: function() {
        return this.orderType === 'delivery';
      }
    },
    state: {
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
    country: {
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
  pickupTime: {
    type: Date,
    required: function() {
      return this.orderType === 'pickup';
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit_card', 'debit_card', 'upi', 'wallet'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    paymentAmount: Number,
    paymentCurrency: {
      type: String,
      default: 'USD'
    }
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