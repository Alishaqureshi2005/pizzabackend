const DeliveryAddress = require('../models/DeliveryAddress');
const User = require('../models/User');

const importData = async () => {
  try {
    await DeliveryAddress.deleteMany({});

    // Get a user to associate with the delivery address
    const user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      throw new Error('User not found. Please seed users first.');
    }

    const deliveryAddresses = [
      {
        user: user._id,
        street: '123 Main Street',
        apartment: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        deliveryInstructions: 'Ring doorbell twice',
        isDefault: true
      },
      {
        user: user._id,
        street: '456 Park Avenue',
        apartment: 'Suite 1203',
        city: 'New York',
        state: 'NY',
        postalCode: '10022',
        country: 'USA',
        coordinates: {
          latitude: 40.7589,
          longitude: -73.9787
        },
        deliveryInstructions: 'Leave with doorman',
        isDefault: false
      },
      {
        user: user._id,
        street: '789 Broadway',
        apartment: 'Floor 5',
        city: 'New York',
        state: 'NY',
        postalCode: '10003',
        country: 'USA',
        coordinates: {
          latitude: 40.7328,
          longitude: -73.9921
        },
        deliveryInstructions: 'Call upon arrival',
        isDefault: false
      },
      // New Address 4
      {
        user: user._id,
        street: '1010 Fifth Avenue',
        apartment: 'Apt 10A',
        city: 'New York',
        state: 'NY',
        postalCode: '10028',
        country: 'USA',
        coordinates: {
          latitude: 40.7769,
          longitude: -73.9637
        },
        deliveryInstructions: 'Leave at front desk',
        isDefault: false
      }
    ];

    await DeliveryAddress.insertMany(deliveryAddresses);
    console.log('Delivery Addresses Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await DeliveryAddress.deleteMany({});
    console.log('Delivery Addresses Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
};
