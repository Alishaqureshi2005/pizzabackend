const Cart = require('../models/Cart');
const User = require('../models/User');

const importData = async () => {
  try {
    await Cart.deleteMany({});

    // Get a user to associate with the cart
    const user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      throw new Error('User not found. Please seed users first.');
    }

    const cart = {
      user: user._id,
      items: [],
      totalAmount: 0,
      status: 'active'
    };

    await Cart.create(cart);
    console.log('Cart Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await Cart.deleteMany({});
    console.log('Carts Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 