const DeliveryZone = require('../models/DeliveryZone');
const asyncHandler = require('express-async-handler');

// @desc    Get all delivery zones
// @route   GET /api/delivery-zones
// @access  Public
exports.getAllDeliveryZones = asyncHandler(async (req, res) => {
  try {
    const zones = await DeliveryZone.find({});
    res.status(200).json({
      success: true,
      count: zones.length,
      data: zones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery zones',
      error: error.message
    });
  }
});

// @desc    Get delivery zone by ID
// @route   GET /api/delivery-zones/:id
// @access  Public
exports.getDeliveryZoneById = asyncHandler(async (req, res) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }
    res.json({
      success: true,
      data: zone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery zone',
      error: error.message
    });
  }
});

// @desc    Get time slots for a delivery zone
// @route   GET /api/delivery-zones/:id/time-slots
// @access  Public
exports.getTimeSlots = asyncHandler(async (req, res) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availableSlots = zone.getAvailableSlots(today);

    res.json({
      success: true,
      data: {
        zoneName: zone.name,
        operatingHours: zone.operatingHours[today],
        availableSlots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching time slots',
      error: error.message
    });
  }
});

// @desc    Update time slot for a delivery zone
// @route   PUT /api/delivery-zones/:id/time-slots/:slotId
// @access  Private/Admin
exports.updateTimeSlot = asyncHandler(async (req, res) => {
  try {
    const { isAvailable, maxOrders } = req.body;
    const { id, slotId } = req.params;

    const zone = await DeliveryZone.findById(id);
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }

    const slot = zone.timeSlots.id(slotId);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Time slot not found'
      });
    }

    if (typeof isAvailable === 'boolean') {
      slot.isAvailable = isAvailable;
    }
    if (typeof maxOrders === 'number') {
      slot.maxOrders = maxOrders;
    }

    await zone.save();

    res.json({
      success: true,
      data: slot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating time slot',
      error: error.message
    });
  }
});

// @desc    Check delivery availability for a location
// @route   POST /api/delivery-zones/check-availability
// @access  Public
exports.checkDeliveryAvailability = asyncHandler(async (req, res) => {
  try {
    const { latitude, longitude, orderAmount } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // Find all active zones
    const zones = await DeliveryZone.find({ isActive: true });

    // Find the closest zone that covers this location
    let closestZone = null;
    let shortestDistance = Infinity;

    for (const zone of zones) {
      if (zone.isLocationInZone(latitude, longitude)) {
        const distance = zone.calculateDeliveryFee(latitude, longitude);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          closestZone = zone;
        }
      }
    }

    if (!closestZone) {
      return res.status(404).json({
        success: false,
        message: 'No delivery zone available for this location'
      });
    }

    // Check minimum order amount
    if (orderAmount && orderAmount < closestZone.minimumOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is Rs. ${closestZone.minimumOrderAmount}`,
        minimumOrderAmount: closestZone.minimumOrderAmount
      });
    }

    // Get available time slots
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const availableSlots = closestZone.getAvailableSlots(today);

    res.json({
      success: true,
      data: {
        zone: {
          id: closestZone._id,
          name: closestZone.name,
          deliveryFee: closestZone.calculateDeliveryFee(latitude, longitude),
          minimumOrderAmount: closestZone.minimumOrderAmount,
          maximumDeliveryTime: closestZone.maximumDeliveryTime
        },
        operatingHours: closestZone.operatingHours[today],
        availableSlots
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking delivery availability',
      error: error.message
    });
  }
});

// @desc    Create a delivery zone
// @route   POST /api/delivery-zones
// @access  Private/Admin
exports.createDeliveryZone = asyncHandler(async (req, res) => {
  try {
    const zone = await DeliveryZone.create(req.body);
    res.status(201).json({
      success: true,
      data: zone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating delivery zone',
      error: error.message
    });
  }
});

// @desc    Update a delivery zone
// @route   PUT /api/delivery-zones/:id
// @access  Private/Admin
exports.updateDeliveryZone = asyncHandler(async (req, res) => {
  try {
    const zone = await DeliveryZone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }

    res.json({
      success: true,
      data: zone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating delivery zone',
      error: error.message
    });
  }
});

// @desc    Delete a delivery zone
// @route   DELETE /api/delivery-zones/:id
// @access  Private/Admin
exports.deleteDeliveryZone = asyncHandler(async (req, res) => {
  try {
    const zone = await DeliveryZone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Delivery zone not found'
      });
    }

    await zone.deleteOne();

    res.json({
      success: true,
      message: 'Delivery zone removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery zone',
      error: error.message
    });
  }
});

// @desc    Restore default delivery zones
// @route   POST /api/delivery-zones/restore
// @access  Private/Admin
exports.restoreDefaultZones = asyncHandler(async (req, res) => {
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

  // Generate time slots for a day
  const generateTimeSlots = (startHour, endHour) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        startTime: `${hour.toString().padStart(2, '0')}:00`,
        endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
        maxOrders: 5,
        isAvailable: true
      });
    }
    return slots;
  };

  const defaultZones = [
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
    }
  ];

  try {
    // Clear existing delivery zones
    await DeliveryZone.deleteMany({});

    // Create new delivery zones
    const zones = await DeliveryZone.insertMany(defaultZones);

    res.status(201).json({
      success: true,
      message: 'Default delivery zones have been restored',
      count: zones.length,
      data: zones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error restoring delivery zones',
      error: error.message
    });
  }
}); 