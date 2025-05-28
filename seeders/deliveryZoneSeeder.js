const mongoose = require('mongoose');
const DeliveryZone = require('../models/DeliveryZone');

// Helper function to generate time slots
const generateTimeSlots = (startHour, endHour) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      maxOrders: 5,
      isAvailable: true,
      currentOrders: 0
    });
  }
  return slots;
};

const standardOperatingHours = {
  monday: { open: '11:00', close: '22:00' },
  tuesday: { open: '11:00', close: '22:00' },
  wednesday: { open: '11:00', close: '22:00' },
  thursday: { open: '11:00', close: '22:00' },
  friday: { open: '11:00', close: '23:00' },
  saturday: { open: '11:00', close: '23:00' },
  sunday: { open: '11:00', close: '22:00' }
};

const deliveryZones = [
  {
    name: 'Mithi Main Bazaar',
    description: 'Main Bazaar area including Shahi Bazaar, Vegetable Market and surrounding shops',
    city: 'Mithi',
    district: 'Tharparkar',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 24.7337,
      longitude: 69.7967
    },
    radius: 1.5, // 1.5 km radius
    baseDeliveryFee: 30, // Lower fee for central area
    minimumOrderAmount: 300,
    maximumDeliveryTime: 20,
    isActive: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours
  },
  {
    name: 'Islamkot Road Zone',
    description: 'Covering Islamkot Road, Thar Coal Housing, and nearby residential areas',
    city: 'Mithi',
    district: 'Tharparkar',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 24.7385,
      longitude: 69.8012
    },
    radius: 3,
    baseDeliveryFee: 60,
    minimumOrderAmount: 500,
    maximumDeliveryTime: 30,
    isActive: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours
  },
  {
    name: 'Nagarparkar Road Area',
    description: 'Areas along Nagarparkar Road including Misri Shah Colony and surroundings',
    city: 'Mithi',
    district: 'Tharparkar',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 24.7290,
      longitude: 69.7945
    },
    radius: 2.5,
    baseDeliveryFee: 50,
    minimumOrderAmount: 400,
    maximumDeliveryTime: 25,
    isActive: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours
  },
  {
    name: 'Diplo Road Zone',
    description: 'Covering Diplo Road, Government Housing, and nearby localities',
    city: 'Mithi',
    district: 'Tharparkar',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 24.7362,
      longitude: 69.7989
    },
    radius: 2,
    baseDeliveryFee: 40,
    minimumOrderAmount: 350,
    maximumDeliveryTime: 25,
    isActive: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours
  },
  {
    name: 'Outer Mithi Zone',
    description: 'Extended delivery zone including outskirts and nearby villages',
    city: 'Mithi',
    district: 'Tharparkar',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 24.7320,
      longitude: 69.7950
    },
    radius: 5,
    baseDeliveryFee: 100,
    minimumOrderAmount: 800,
    maximumDeliveryTime: 45,
    isActive: true
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
