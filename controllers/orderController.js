const Order = require('../models/Order');
const Cart = require('../models/Cart');
const printerService = require('../services/printerService');
const socketService = require('../services/socketService');
const logger = require('../utils/logger');
const deliveryZoneService = require('../services/deliveryZoneService');

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { 
      items, 
      customerInfo, 
      orderType, 
      paymentMethod, 
      total,
      deliveryAddress,
      deliveryCharge,
      deliveryZone,
      estimatedDeliveryTime,
      tax = 0,
      discount = 0,
      notes
    } = req.body;

    // Validate orderType
    if (!orderType || !['delivery', 'pickup'].includes(orderType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing orderType. Must be "delivery" or "pickup".'
      });
    }

    // Validate paymentMethod
    if (!paymentMethod || !['cash', 'card'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing paymentMethod. Must be "cash" or "card".'
      });
    }

    // Validate delivery address for delivery orders
    if (orderType === 'delivery' && (!deliveryAddress || !deliveryAddress.address || !deliveryAddress.area)) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address and area are required for delivery orders'
      });
    }

    // Calculate total price from items
    const totalPrice = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Calculate final price
    const finalDeliveryCharge = orderType === 'delivery' ? (deliveryCharge || 0) : 0;
    const finalPrice = totalPrice + finalDeliveryCharge + (tax || 0) - (discount || 0);

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        customization: {
          size: item.customization?.size,
          toppings: item.customization?.toppings,
          specialInstructions: item.customization?.specialInstructions
        }
      })),
      totalPrice,
      deliveryAddress: orderType === 'delivery' ? {
        address: deliveryAddress.address,
        area: deliveryAddress.area
      } : undefined,
      paymentMethod,
      orderType,
      deliveryCharge: finalDeliveryCharge,
      tax: tax || 0,
      discount: discount || 0,
      finalPrice,
      deliveryZone: orderType === 'delivery' ? deliveryZone : undefined,
      estimatedDeliveryTime: orderType === 'delivery' ? estimatedDeliveryTime : undefined,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.populate('items.product');

    // Emit new order event via Socket.IO
    socketService.emitNewOrder(order);

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
    console.error('Error creating order:', error);
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
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('user');

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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status || !['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing status.'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }
    if (status === 'cancelled') {
      order.cancellationReason = req.body.cancellationReason || 'Cancelled by Admin';
    }

    await order.save();

    // Emit order status update via Socket.IO
    socketService.emitOrderStatusUpdate(order);

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

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
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
    const { status, sortBy = 'date', sortOrder = 'desc' } = req.query;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    let sortField = 'createdAt';
    if (sortBy === 'date') {
      sortField = 'createdAt';
    } else if (sortBy === 'status') {
      sortField = 'status';
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const orders = await Order.find(query)
      .populate('items.product')
      .populate('user')
      .sort({ [sortField]: sortDirection });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this user'
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders by user ID',
      error: error.message
    });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  console.log('getAllOrders function called');
  try {
    const { status, sortBy = 'date', sortOrder = 'desc' } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    let sortField = 'createdAt';
    if (sortBy === 'date') {
      sortField = 'createdAt';
    } else if (sortBy === 'status') {
      sortField = 'status';
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const orders = await Order.find(query)
      .populate('items.product')
      .populate('user')
      .sort({ [sortField]: sortDirection });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all orders',
      error: error.message
    });
  }
};