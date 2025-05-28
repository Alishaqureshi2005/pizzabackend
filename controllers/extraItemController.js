const ExtraItem = require('../models/ExtraItem');

// Get all extra items
exports.getAllExtraItems = async (req, res) => {
  try {
    const extraItems = await ExtraItem.find({ isAvailable: true });
    res.status(200).json({
      success: true,
      count: extraItems.length,
      data: extraItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get extra items by category
exports.getExtraItemsByCategory = async (req, res) => {
  try {
    const extraItems = await ExtraItem.find({ 
      category: req.params.category,
      isAvailable: true 
    });
    res.status(200).json({
      success: true,
      count: extraItems.length,
      data: extraItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new extra item
exports.createExtraItem = async (req, res) => {
  try {
    const extraItem = await ExtraItem.create(req.body);
    res.status(201).json({
      success: true,
      data: extraItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update extra item
exports.updateExtraItem = async (req, res) => {
  try {
    const extraItem = await ExtraItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!extraItem) {
      return res.status(404).json({
        success: false,
        error: 'Extra item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: extraItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete extra item
exports.deleteExtraItem = async (req, res) => {
  try {
    const extraItem = await ExtraItem.findByIdAndDelete(req.params.id);

    if (!extraItem) {
      return res.status(404).json({
        success: false,
        error: 'Extra item not found'
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

// Get single extra item
exports.getExtraItem = async (req, res) => {
  try {
    const extraItem = await ExtraItem.findById(req.params.id);

    if (!extraItem) {
      return res.status(404).json({
        success: false,
        error: 'Extra item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: extraItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 