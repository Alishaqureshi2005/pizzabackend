const Order = require('../models/Order');
const User = require('../models/User');
const Cart = require('../models/Cart');

const importData = async () => {
  try {
    await Order.deleteMany({});

    // Get a user to associate with the order
    const user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      throw new Error('User not found. Please seed users first.');
    }

    // Get a cart to associate with the order
    const cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      throw new Error('Cart not found. Please seed cart first.');
    }

    const orders = [
      {
        user: user._id,
        cart: cart._id,
        status: 'pending',
        totalAmount: 0,
        deliveryAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'credit_card',
        paymentStatus: 'pending'
      },
      {
        user: user._id,
        cart: cart._id,
        status: 'completed',
        totalAmount: 0,
        deliveryAddress: {
          street: '456 Park Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          country: 'USA'
        },
        paymentMethod: 'cash',
        paymentStatus: 'completed'
      }
    ];

    await Order.insertMany(orders);
    console.log('Orders Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany({});
    console.log('Orders Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 