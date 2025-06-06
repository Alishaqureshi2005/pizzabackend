const mongoose = require('mongoose');
const DeliveryZone = require('../models/DeliveryZone');

const deliveryZones = [
  {
    name: 'Saddar',
    distance: 2.5,
    deliveryFee: 40,
    estimatedTime: 30
  },
  {
    name: 'Latifabad',
    distance: 3,
    deliveryFee: 50,
    estimatedTime: 35  // ✅ FIXED TYPO HERE
  },
  {
    name: 'Qasimabad',
    distance: 2.5,
    deliveryFee: 45,
    estimatedTime: 32
  },
  {
    name: 'Hirabad',
    distance: 2,
    deliveryFee: 40,
    estimatedTime: 28
  },
  {
    name: 'SITE Area',
    distance: 3,
    deliveryFee: 50,
    estimatedTime: 35
  }
];


const importData = async () => {
  try {
    // Clear existing delivery zones
    await DeliveryZone.deleteMany({});

    // Insert new delivery zones
    const createdZones = await DeliveryZone.insertMany(deliveryZones);

    console.log('Delivery Zones imported successfully!');
    return createdZones;
  } catch (error) {
    console.error('Error importing delivery zones:', error);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await DeliveryZone.deleteMany({});
    console.log('Delivery Zones destroyed successfully!');
  } catch (error) {
    console.error('Error destroying delivery zones:', error);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
};
