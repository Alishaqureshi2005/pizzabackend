const Order = require('../models/Order');
const Cart = require('../models/Cart');
const printerService = require('../services/printerService');
const logger = require('../utils/logger');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
const deliveryZoneService = require('../services/deliveryZoneService');

exports.createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, orderType } = req.body;

    // Validate orderType
    if (!orderType || !['delivery', 'pickup'].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing orderType. Must be "delivery" or "pickup".'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    let deliveryCharge = 0;
    let deliveryZone = null;

    if (orderType === 'delivery') {
      if (!deliveryAddress || !deliveryAddress.coordinates || typeof deliveryAddress.coordinates.latitude !== 'number' || typeof deliveryAddress.coordinates.longitude !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Delivery address with valid coordinates is required for delivery orders.'
        });
      }

      // Calculate delivery charge and find matching zone
      const result = await deliveryZoneService.calculateDeliveryCharge(deliveryAddress.coordinates);
      deliveryCharge = result.deliveryCharge;
      deliveryZone = result.zone ? result.zone._id : null;

      if (!deliveryZone) {
        return res.status(400).json({
          success: false,
          message: 'Delivery is not available at the provided location.'
        });
      }
    }

    // Create order from cart items
    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization
      })),
      totalPrice: cart.totalPrice,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
      paymentMethod,
      orderType,
      deliveryCharge,
      deliveryZone
    });

    // Clear the cart
    cart.items = [];
    await cart.save();

    await order.populate('items.product');

    // Print receipts
    try {
      // Print kitchen order
      await printerService.printOrder(order, 'kitchenOrder');
      
      // Print customer receipt
      await printerService.printOrder(order, 'customerReceipt');
      
      // Print delivery slip if it's a delivery order
      if (order.orderType === 'delivery') {
        await printerService.printOrder(order, 'deliverySlip');
      }
    } catch (printError) {
      logger.error('Error printing order receipts:', printError);
      // Don't fail the order creation if printing fails
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    console.log('Received query parameters:', req.query);
    const { status, sortBy = 'date', sortOrder = 'desc' } = req.query;

    // Build query object
    let query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    // Map sortBy to actual field in DB
    let sortField = 'createdAt';
    if (sortBy === 'date') {
      sortField = 'createdAt';
    } else if (sortBy === 'status') {
      sortField = 'status';
    } // Add more fields if needed

    // Determine sort order
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ [sortField]: sortDirection });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    await order.populate('items.product');

    // Print updated order if status is 'preparing'
    if (status === 'preparing') {
      try {
        await printerService.printOrder(order, 'kitchenOrder');
      } catch (printError) {
        logger.error('Error printing updated order:', printError);
        // Don't fail the status update if printing fails
      }
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product')
      .populate('user', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this order'
      });
    }

    // Only allow deletion of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending orders'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// @desc    Get orders by user ID
// @route   GET /api/orders/user/:userId
// @access  Private/Admin
exports.getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, startDate, endDate } = req.query;

    // Build query
    let query = { user: userId };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('items.product')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders by user',
      error: error.message
    });
  }
}; 