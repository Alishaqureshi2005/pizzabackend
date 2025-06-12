const DeliveryZone = require('../models/DeliveryZone');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizzahouse');

const deliveryZones = [
  {
    name: 'Zone 1 - Downtown',
    distance: 5,
    deliveryFee: 0,
    minimumOrderPrice: 15,
    estimatedTime: 20,
    isActive: true
  },
  {
    name: 'Zone 2 - Midtown',
    distance: 10,
    deliveryFee: 2.99,
    minimumOrderPrice: 20,
    estimatedTime: 35,
    isActive: true
  },
  {
    name: 'Zone 3 - Uptown',
    distance: 15,
    deliveryFee: 4.99,
    minimumOrderPrice: 25,
    estimatedTime: 45,
    isActive: true
  },
  {
    name: 'Zone 4 - Suburbs',
    distance: 20,
    deliveryFee: 6.99,
    minimumOrderPrice: 30,
    estimatedTime: 60,
    isActive: true
  }
];

// Import data
const importData = async () => {
  try {
    await DeliveryZone.deleteMany();
    await DeliveryZone.insertMany(deliveryZones);
    console.log('Delivery Zones Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const destroyData = async () => {
  try {
    await DeliveryZone.deleteMany();
    console.log('Delivery Zones Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
