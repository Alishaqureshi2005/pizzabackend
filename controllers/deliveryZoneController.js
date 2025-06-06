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

// @desc    Create a delivery zone
// @route   POST /api/delivery-zones
// @access  Private/Admin
exports.createDeliveryZone = async (req, res) => {
  try {
    const { name, distance, deliveryFee ,estimatedTime} = req.body;

    const deliveryZone = await DeliveryZone.create({
      name,
      distance,
      deliveryFee,
     estimatedTime
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
    const { name, distance, deliveryFee, estimatedTime, isActive } = req.body;

    const deliveryZone = await DeliveryZone.findByIdAndUpdate(
      id,
      { name, distance, deliveryFee, isActive , estimatedTime },
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
