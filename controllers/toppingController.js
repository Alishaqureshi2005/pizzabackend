const Topping = require('../models/Topping');

// Get all toppings
exports.getAllToppings = async (req, res) => {
  try {
    const toppings = await Topping.find({ isAvailable: true });
    res.status(200).json({
      success: true,
      count: toppings.length,
      data: toppings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get toppings by type
exports.getToppingsByType = async (req, res) => {
  try {
    const toppings = await Topping.find({ 
      type: req.params.type,
      isAvailable: true 
    });
    res.status(200).json({
      success: true,
      count: toppings.length,
      data: toppings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get popular toppings
exports.getPopularToppings = async (req, res) => {
  try {
    const toppings = await Topping.find({ 
      isPopular: true,
      isAvailable: true 
    });
    res.status(200).json({
      success: true,
      count: toppings.length,
      data: toppings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get vegetarian toppings
exports.getVegetarianToppings = async (req, res) => {
  try {
    const toppings = await Topping.find({ 
      isVegetarian: true,
      isAvailable: true 
    });
    res.status(200).json({
      success: true,
      count: toppings.length,
      data: toppings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new topping
exports.createTopping = async (req, res) => {
  try {
    const topping = await Topping.create(req.body);
    res.status(201).json({
      success: true,
      data: topping
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update topping
exports.updateTopping = async (req, res) => {
  try {
    const topping = await Topping.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!topping) {
      return res.status(404).json({
        success: false,
        error: 'Topping not found'
      });
    }

    res.status(200).json({
      success: true,
      data: topping
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete topping
exports.deleteTopping = async (req, res) => {
  try {
    const topping = await Topping.findByIdAndDelete(req.params.id);

    if (!topping) {
      return res.status(404).json({
        success: false,
        error: 'Topping not found'
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

// Get single topping
exports.getTopping = async (req, res) => {
  try {
    const topping = await Topping.findById(req.params.id);

    if (!topping) {
      return res.status(404).json({
        success: false,
        error: 'Topping not found'
      });
    }

    res.status(200).json({
      success: true,
      data: topping
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 