const printerService = require('../services/printerService');
const printerConfig = require('../config/printer');
const logger = require('../utils/logger');

// @desc    Get printer settings
// @route   GET /api/printer/settings
// @access  Private/Admin
exports.getPrinterSettings = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: printerService.settings
    });
  } catch (error) {
    logger.error('Get printer settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching printer settings',
      error: error.message
    });
  }
};

// @desc    Update printer settings
// @route   PUT /api/printer/settings
// @access  Private/Admin
exports.updatePrinterSettings = async (req, res) => {
  try {
    const settings = req.body;

    // Validate settings
    if (!settings.type || !settings.ip || !settings.port || !settings.model) {
      return res.status(400).json({
        success: false,
        message: 'Missing required settings',
        required: ['type', 'ip', 'port', 'model']
      });
    }

    // Validate printer model
    const model = printerConfig.supportedModels.find(m => m.name === settings.model);
    if (!model) {
      return res.status(400).json({
        success: false,
        message: printerConfig.errorMessages.UNSUPPORTED_MODEL
      });
    }

    // Test connection with new settings
    await printerService.connect(settings);

    res.status(200).json({
      success: true,
      data: printerService.settings
    });
  } catch (error) {
    logger.error('Update printer settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating printer settings',
      error: error.message
    });
  }
};

// @desc    Print test page
// @route   POST /api/printer/test
// @access  Private/Admin
exports.printTest = async (req, res) => {
  try {
    await printerService.printTest();
    res.status(200).json({
      success: true,
      message: 'Test page printed successfully'
    });
  } catch (error) {
    logger.error('Print test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error printing test page',
      error: error.message
    });
  }
};

// @desc    Print order
// @route   POST /api/printer/print
// @access  Private/Admin
exports.printOrder = async (req, res) => {
  try {
    const { order, template } = req.body;

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order data is required'
      });
    }

    await printerService.printOrder(order, template);
    res.status(200).json({
      success: true,
      message: 'Order printed successfully'
    });
  } catch (error) {
    logger.error('Print order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error printing order',
      error: error.message
    });
  }
}; 