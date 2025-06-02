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
  monday: { open: '11:00', close: '23:00' },
  tuesday: { open: '11:00', close: '23:00' },
  wednesday: { open: '11:00', close: '23:00' },
  thursday: { open: '11:00', close: '23:00' },
  friday: { open: '11:00', close: '23:30' },
  saturday: { open: '11:00', close: '23:30' },
  sunday: { open: '11:00', close: '23:00' }
};

const deliveryZones = [
  {
    name: 'Saddar',
    description: 'Covering Saddar area, including main market and surrounding commercial areas',
    city: 'Hyderabad',
    district: 'Hyderabad',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 25.3960,
      longitude: 68.3578
    },
    radius: 2.5,
    baseDeliveryFee: 40,
    minimumOrderAmount: 400,
    maximumDeliveryTime: 25,
    isActive: true,
    timeSlots: generateTimeSlots(11, 23),
    operatingHours: standardOperatingHours
  },
  {
    name: 'Latifabad',
    description: 'Covering Latifabad Unit 1-12 and surrounding residential areas',
    city: 'Hyderabad',
    district: 'Hyderabad',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 25.3797,
      longitude: 68.3600
    },
    radius: 3,
    baseDeliveryFee: 50,
    minimumOrderAmount: 500,
    maximumDeliveryTime: 30,
    isActive: true,
    timeSlots: generateTimeSlots(11, 23),
    operatingHours: standardOperatingHours
  },
  {
    name: 'Qasimabad',
    description: 'Covering Qasimabad, including residential and commercial areas',
    city: 'Hyderabad',
    district: 'Hyderabad',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 25.3867,
      longitude: 68.3667
    },
    radius: 2.5,
    baseDeliveryFee: 45,
    minimumOrderAmount: 450,
    maximumDeliveryTime: 25,
    isActive: true,
    timeSlots: generateTimeSlots(11, 23),
    operatingHours: standardOperatingHours
  },
  {
    name: 'Hirabad',
    description: 'Covering Hirabad, including commercial and residential areas',
    city: 'Hyderabad',
    district: 'Hyderabad',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 25.3920,
      longitude: 68.3650
    },
    radius: 2,
    baseDeliveryFee: 40,
    minimumOrderAmount: 400,
    maximumDeliveryTime: 20,
    isActive: true,
    timeSlots: generateTimeSlots(11, 23),
    operatingHours: standardOperatingHours
  },
  {
    name: 'SITE Area',
    description: 'Covering SITE industrial area and surrounding commercial zones',
    city: 'Hyderabad',
    district: 'Hyderabad',
    province: 'Sindh',
    country: 'Pakistan',
    coordinates: {
      latitude: 25.4000,
      longitude: 68.3500
    },
    radius: 3,
    baseDeliveryFee: 50,
    minimumOrderAmount: 500,
    maximumDeliveryTime: 30,
    isActive: true,
    timeSlots: generateTimeSlots(11, 23),
    operatingHours: standardOperatingHours
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
