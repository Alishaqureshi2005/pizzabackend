const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const importData = async () => {
  try {
    await Order.deleteMany({});

    // Get a user to associate with the order
    const user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      throw new Error('User not found. Please seed users first.');
    }

    // Get some products to add to orders
    const products = await Product.find().limit(2);
    if (!products.length) {
      throw new Error('Products not found. Please seed products first.');
    }

    const orders = [
      {
        user: user._id,
        items: [
          {
            product: products[0]._id,
            quantity: 2,
            price: products[0].price,
            customization: {
              size: 'medium',
              toppings: [],
              specialInstructions: 'Extra cheese please'
            }
          }
        ],
        totalPrice: products[0].price * 2,
        orderType: 'delivery',
        deliveryAddress: {
          street: '123 Main St',
          city: 'Hyderabad',
          postalCode: '500001',
          coordinates: {
            latitude: 17.3850,
            longitude: 78.4867
          }
        },
        paymentMethod: 'card',
        paymentStatus: 'paid',
        status: 'delivered',
        deliveryCharge: 50,
        tax: 0,
        discount: 0,
        finalPrice: (products[0].price * 2) + 50
      },
      {
        user: user._id,
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].price,
            customization: {
              size: 'large',
              toppings: [],
              specialInstructions: 'No onions'
            }
          }
        ],
        totalPrice: products[1].price,
        orderType: 'pickup',
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        status: 'completed',
        deliveryCharge: 0,
        tax: 0,
        discount: 0,
        finalPrice: products[1].price
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