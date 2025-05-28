const DeliveryAddress = require('../models/DeliveryAddress');
const DeliveryZone = require('../models/DeliveryZone');

// @desc    Get user's delivery addresses
// @route   GET /api/delivery-addresses
// @access  Private
exports.getDeliveryAddresses = async (req, res) => {
  try {
    const addresses = await DeliveryAddress.find({ user: req.user.id })
      .sort('-isDefault -createdAt');

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery addresses',
      error: error.message
    });
  }
};

// @desc    Add delivery address
// @route   POST /api/delivery-addresses
// @access  Private
exports.addDeliveryAddress = async (req, res) => {
  try {
    const {
      addressType,
      isDefault,
      street,
      apartment,
      city,
      state,
      postalCode,
      country,
      coordinates,
      deliveryInstructions
    } = req.body;

    // Check if delivery is available in the zone
    const location = [coordinates.longitude, coordinates.latitude];
    const availableZones = await DeliveryZone.find({ isAvailable: true });
    const matchingZone = availableZones.find(zone => zone.isLocationInZone(location));

    if (!matchingZone) {
      return res.status(400).json({
        success: false,
        message: 'Delivery is not available at this location'
      });
    }

    const address = await DeliveryAddress.create({
      user: req.user.id,
      addressType,
      isDefault,
      street,
      apartment,
      city,
      state,
      postalCode,
      country,
      coordinates,
      deliveryInstructions
    });

    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding delivery address',
      error: error.message
    });
  }
};

// @desc    Update delivery address
// @route   PUT /api/delivery-addresses/:id
// @access  Private
exports.updateDeliveryAddress = async (req, res) => {
  try {
    const address = await DeliveryAddress.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Delivery address not found'
      });
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this address'
      });
    }

    // If coordinates are being updated, check delivery availability
    if (req.body.coordinates) {
      const location = [req.body.coordinates.longitude, req.body.coordinates.latitude];
      const availableZones = await DeliveryZone.find({ isAvailable: true });
      const matchingZone = availableZones.find(zone => zone.isLocationInZone(location));

      if (!matchingZone) {
        return res.status(400).json({
          success: false,
          message: 'Delivery is not available at this location'
        });
      }
    }

    const updatedAddress = await DeliveryAddress.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: updatedAddress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating delivery address',
      error: error.message
    });
  }
};

// @desc    Delete delivery address
// @route   DELETE /api/delivery-addresses/:id
// @access  Private
exports.deleteDeliveryAddress = async (req, res) => {
  try {
    const address = await DeliveryAddress.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Delivery address not found'
      });
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this address'
      });
    }

    await address.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery address',
      error: error.message
    });
  }
};

// @desc    Set default delivery address
// @route   PUT /api/delivery-addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await DeliveryAddress.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Delivery address not found'
      });
    }

    // Check if address belongs to user
    if (address.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this address'
      });
    }

    // Set all user's addresses to non-default
    await DeliveryAddress.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting default address',
      error: error.message
    });
  }
};

// @desc    Reset all delivery addresses for a user
// @route   DELETE /api/delivery-addresses/reset
// @access  Private
exports.resetDeliveryAddresses = async (req, res) => {
  try {
    // Delete all addresses for the current user
    await DeliveryAddress.deleteMany({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: 'All delivery addresses have been reset',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting delivery addresses',
      error: error.message
    });
  }
}; 