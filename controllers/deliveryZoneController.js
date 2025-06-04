const DeliveryZone = require('../models/DeliveryZone');
const asyncHandler = require('express-async-handler');

// @desc    Get all delivery zones
// @route   GET /api/delivery-zones
// @access  Public
exports.getAllDeliveryZones = async (req, res) => {
  try {
    const deliveryZones = await DeliveryZone.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: deliveryZones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching delivery zones'
    });
  }
};

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
exports.createDeliveryZone = async (req, res) => {
  try {
    const { name, distance, deliveryFee } = req.body;

    const deliveryZone = await DeliveryZone.create({
      name,
      distance,
      deliveryFee
    });

    res.status(201).json({
      success: true,
      data: deliveryZone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update a delivery zone
// @route   PUT /api/delivery-zones/:id
// @access  Private/Admin
exports.updateDeliveryZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, distance, deliveryFee, isActive } = req.body;

    const deliveryZone = await DeliveryZone.findByIdAndUpdate(
      id,
      { name, distance, deliveryFee, isActive },
      { new: true, runValidators: true }
    );

    if (!deliveryZone) {
      return res.status(404).json({
        success: false,
        error: 'Delivery zone not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deliveryZone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete a delivery zone
// @route   DELETE /api/delivery-zones/:id
// @access  Private/Admin
exports.deleteDeliveryZone = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryZone = await DeliveryZone.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deliveryZone) {
      return res.status(404).json({
        success: false,
        error: 'Delivery zone not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get delivery fee for an address
// @route   POST /api/delivery-zones/get-delivery-fee
// @access  Public
exports.getDeliveryFee = async (req, res) => {
  try {
    const { address } = req.body;

    // Find the delivery zone with the highest delivery fee
    const highestFeeZone = await DeliveryZone.findOne({ isActive: true })
      .sort({ deliveryFee: -1 });

    if (!highestFeeZone) {
      return res.status(404).json({
        success: false,
        error: 'No delivery zones found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        deliveryFee: highestFeeZone.deliveryFee,
        isOutOfZone: true
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 