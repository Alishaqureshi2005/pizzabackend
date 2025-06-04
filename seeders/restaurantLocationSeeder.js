const mongoose = require('mongoose');
const RestaurantLocation = require('../models/RestaurantLocation');
const DeliveryZone = require('../models/DeliveryZone');

const restaurantLocations = [
  {
    name: 'Pizza House',
    branchName: 'Mithi Main Branch',
    address: 'Shop #123, Main Bazaar Road, Near Clock Tower',
    city: 'Mithi',
    district: 'Tharparkar',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 24.7337,
      longitude: 69.7967
    },
    contactNumber: '+92-333-1234567',
    isActive: true,
    operatingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '23:30' },
      saturday: { open: '11:00', close: '23:30' },
      sunday: { open: '11:00', close: '23:00' }
    }
  },
  {
    name: 'Pizza House',
    branchName: 'Islamkot Road Branch',
    address: 'Shop #45, Thar Coal Housing Society, Islamkot Road',
    city: 'Mithi',
    district: 'Tharparkar',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 24.7385,
      longitude: 69.8012
    },
    contactNumber: '+92-333-7654321',
    isActive: true,
    operatingHours: {
      monday: { open: '11:00', close: '22:30' },
      tuesday: { open: '11:00', close: '22:30' },
      wednesday: { open: '11:00', close: '22:30' },
      thursday: { open: '11:00', close: '22:30' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:30' }
    }
  },
  {
    name: 'Pizza Extreme',
    branchName: 'Saddar Branch',
    address: 'S.No: 08 G/Floor Naaz & Bilal Shopping Mall, Saddar',
    city: 'Hyderabad',
    district: 'Hyderabad',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 25.3969,
      longitude: 68.3778
    },
    contactNumber: '+92-333-1234567',
    isActive: true,
    operatingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '23:30' },
      saturday: { open: '11:00', close: '23:30' },
      sunday: { open: '11:00', close: '23:00' }
    }
  }
];

const importData = async () => {
  try {
    // Clear existing restaurant locations
    await RestaurantLocation.deleteMany({});

    // Get all delivery zones
    const deliveryZones = await DeliveryZone.find({});
    
    // Add delivery zones to each restaurant
    const locationsWithZones = restaurantLocations.map(location => ({
      ...location,
      deliveryZones: deliveryZones.map(zone => zone._id)
    }));

    // Insert new restaurant locations
    await RestaurantLocation.insertMany(locationsWithZones);

    console.log('Restaurant Locations imported successfully!');
  } catch (error) {
    console.error('Error importing restaurant locations:', error);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await RestaurantLocation.deleteMany({});
    console.log('Restaurant Locations destroyed successfully!');
  } catch (error) {
    console.error('Error destroying restaurant locations:', error);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
}; 