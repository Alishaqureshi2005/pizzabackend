const RestaurantLocation = require('../models/RestaurantLocation');
const asyncHandler = require('express-async-handler');

// @desc    Get all restaurant locations
// @route   GET /api/restaurants
// @access  Public
exports.getRestaurants = asyncHandler(async (req, res) => {
  try {
    const restaurants = await RestaurantLocation.find({ isActive: true })
      .populate('deliveryZones');

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants',
      error: error.message
    });
  }
});

// @desc    Get nearest restaurant and delivery info
// @route   GET /api/restaurants/nearest
// @access  Public
exports.getNearestRestaurant = asyncHandler(async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const restaurants = await RestaurantLocation.find({ isActive: true })
      .populate('deliveryZones');

    let nearestRestaurant = null;
    let shortestDistance = Infinity;
    let applicableZone = null;

    for (const restaurant of restaurants) {
      const distance = restaurant.calculateDistanceTo(parseFloat(latitude), parseFloat(longitude));
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestRestaurant = restaurant;

        // Find applicable delivery zone
        applicableZone = restaurant.deliveryZones.find(zone => 
          zone.isLocationInZone(parseFloat(latitude), parseFloat(longitude))
        );
      }
    }

    if (!nearestRestaurant) {
      return res.status(404).json({
        success: false,
        message: 'No restaurants found'
      });
    }

    if (!applicableZone) {
      return res.status(400).json({
        success: false,
        message: 'Location is outside delivery zones',
        data: {
          restaurant: nearestRestaurant,
          distance: shortestDistance
        }
      });
    }

    const deliveryFee = applicableZone.calculateDeliveryFee(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.status(200).json({
      success: true,
      data: {
        restaurant: nearestRestaurant,
        distance: shortestDistance,
        deliveryZone: applicableZone,
        deliveryFee,
        estimatedTime: Math.ceil(applicableZone.maximumDeliveryTime * (distance / applicableZone.radius))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding nearest restaurant',
      error: error.message
    });
  }
});

// @desc    Create restaurant location
// @route   POST /api/restaurants
// @access  Private/Admin
exports.createRestaurant = asyncHandler(async (req, res) => {
  try {
    const restaurant = await RestaurantLocation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating restaurant',
      error: error.message
    });
  }
});

// @desc    Update restaurant location
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
exports.updateRestaurant = asyncHandler(async (req, res) => {
  try {
    const restaurant = await RestaurantLocation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating restaurant',
      error: error.message
    });
  }
});

// @desc    Delete restaurant location
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
exports.deleteRestaurant = asyncHandler(async (req, res) => {
  try {
    const restaurant = await RestaurantLocation.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting restaurant',
      error: error.message
    });
  }
}); 