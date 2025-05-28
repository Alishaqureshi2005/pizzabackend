const DeliveryArea = require('../models/DeliveryArea');
const DeliveryZone = require('../models/DeliveryZone');

// Helper function to generate time slots
const generateTimeSlots = (startHour, endHour, slotDuration = 30) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endMinute = (minute + slotDuration) % 60;
      const endHour = minute + slotDuration >= 60 ? hour + 1 : hour;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      slots.push({
        startTime,
        endTime,
        maxOrders: 5,
        isAvailable: true
      });
    }
  }
  return slots;
};

// Standard operating hours
const standardOperatingHours = {
  monday: { open: '11:00', close: '22:00' },
  tuesday: { open: '11:00', close: '22:00' },
  wednesday: { open: '11:00', close: '22:00' },
  thursday: { open: '11:00', close: '22:00' },
  friday: { open: '11:00', close: '23:00' },
  saturday: { open: '11:00', close: '23:00' },
  sunday: { open: '11:00', close: '22:00' }
};

// Restaurant's central location (example coordinates for NYC)
const restaurantLocation = {
  type: 'Point',
  coordinates: [-73.935242, 40.730610] // Example coordinates for NYC
};

const deliveryZones = [
  // Zone 1: 0-5km (Free Delivery)
  {
    name: 'Free Delivery Zone',
    description: 'Free delivery within 5km radius',
    distanceRange: {
      min: 0,
      max: 5
    },
    deliveryCharge: 0,
    minimumOrderAmount: 15.00,
    estimatedDeliveryTime: 20,
    isAvailable: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours,
    deliverySettings: {
      maxOrdersPerSlot: 5,
      advanceBookingHours: 24,
      slotDuration: 30
    },
    restaurantLocation,
    adminNotes: 'High priority zone - Free delivery to encourage local orders',
    priority: 1
  },

  // Zone 2: 5-10km
  {
    name: 'Standard Delivery Zone',
    description: 'Standard delivery charges for 5-10km radius',
    distanceRange: {
      min: 5,
      max: 10
    },
    deliveryCharge: 2.99,
    minimumOrderAmount: 20.00,
    estimatedDeliveryTime: 35,
    isAvailable: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours,
    deliverySettings: {
      maxOrdersPerSlot: 4,
      advanceBookingHours: 24,
      slotDuration: 30
    },
    restaurantLocation,
    adminNotes: 'Standard delivery zone - Moderate traffic areas',
    priority: 2
  },

  // Zone 3: 10-15km
  {
    name: 'Extended Delivery Zone',
    description: 'Extended delivery area with higher charges',
    distanceRange: {
      min: 10,
      max: 15
    },
    deliveryCharge: 4.99,
    minimumOrderAmount: 25.00,
    estimatedDeliveryTime: 45,
    isAvailable: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours,
    deliverySettings: {
      maxOrdersPerSlot: 3,
      advanceBookingHours: 24,
      slotDuration: 30
    },
    restaurantLocation,
    adminNotes: 'Extended delivery zone - Higher delivery charges apply',
    priority: 3
  },

  // Zone 4: 15-20km
  {
    name: 'Premium Delivery Zone',
    description: 'Premium delivery service for distant locations',
    distanceRange: {
      min: 15,
      max: 20
    },
    deliveryCharge: 6.99,
    minimumOrderAmount: 30.00,
    estimatedDeliveryTime: 60,
    isAvailable: true,
    timeSlots: generateTimeSlots(11, 22),
    operatingHours: standardOperatingHours,
    deliverySettings: {
      maxOrdersPerSlot: 2,
      advanceBookingHours: 48,
      slotDuration: 45
    },
    restaurantLocation,
    adminNotes: 'Premium delivery zone - Limited slots available',
    priority: 4
  },

  // New Zone 5: 20-25km
  {
    name: 'Outskirts Delivery Zone',
    description: 'Delivery service for outskirts with higher charges',
    distanceRange: {
      min: 20,
      max: 25
    },
    deliveryCharge: 9.99,
    minimumOrderAmount: 35.00,
    estimatedDeliveryTime: 75,
    isAvailable: true,
    timeSlots: generateTimeSlots(11, 21),
    operatingHours: standardOperatingHours,
    deliverySettings: {
      maxOrdersPerSlot: 1,
      advanceBookingHours: 72,
      slotDuration: 60
    },
    restaurantLocation,
    adminNotes: 'Outskirts delivery zone - Limited availability',
    priority: 5
  }
];

const deliveryAreas = [
  {
    name: 'Downtown Area',
    description: 'Central business district',
    // zoneId: to be set dynamically
    boundaries: {
      type: 'Polygon',
      coordinates: [[
        [-73.935242, 40.730610],
        [-73.935242, 40.740610],
        [-73.925242, 40.740610],
        [-73.925242, 40.730610],
        [-73.935242, 40.730610]
      ]]
    },
    isActive: true,
    priority: 1
  },
  {
    name: 'Midtown Area',
    description: 'Midtown residential and commercial',
    boundaries: {
      type: 'Polygon',
      coordinates: [[
        [-73.945242, 40.750610],
        [-73.945242, 40.760610],
        [-73.935242, 40.760610],
        [-73.935242, 40.750610],
        [-73.945242, 40.750610]
      ]]
    },
    isActive: true,
    priority: 2
  },
  {
    name: 'Uptown Area',
    description: 'Northern residential area',
    boundaries: {
      type: 'Polygon',
      coordinates: [[
        [-73.955242, 40.770610],
        [-73.955242, 40.780610],
        [-73.945242, 40.780610],
        [-73.945242, 40.770610],
        [-73.955242, 40.770610]
      ]]
    },
    isActive: true,
    priority: 3
  },
  // New Area 4: Suburban Area
  {
    name: 'Suburban Area',
    description: 'Suburban residential area',
    boundaries: {
      type: 'Polygon',
      coordinates: [[
        [-73.965242, 40.790610],
        [-73.965242, 40.800610],
        [-73.955242, 40.800610],
        [-73.955242, 40.790610],
        [-73.965242, 40.790610]
      ]]
    },
    isActive: true,
    priority: 4
  }
];

const importData = async () => {
  try {
    // Clear existing delivery areas
    await DeliveryArea.deleteMany({});

    // Get all delivery zones
    const zones = await DeliveryZone.find({});
    if (zones.length < 4) {
      throw new Error('Not enough delivery zones found. Please seed delivery zones first.');
    }

    // Assign zoneId to each area (for demo, map 1:1)
    const areasWithZone = deliveryAreas.map((area, idx) => ({
      ...area,
      zoneId: zones[idx % zones.length]._id
    }));

    await DeliveryArea.insertMany(areasWithZone);
    console.log('Delivery Areas Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await DeliveryArea.deleteMany({});
    console.log('Delivery Areas Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
};
