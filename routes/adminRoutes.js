const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getOrders,
  getOrder,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/adminController');

// Apply authentication and authorization middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Category routes
router
  .route('/categories')
  .get(getCategories)
  .post(createCategory);

router
  .route('/categories/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

// Product routes
router
  .route('/products')
  .get(getProducts)
  .post(createProduct);

router
  .route('/products/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

// Dashboard route
router.get('/dashboard', getDashboardStats);

// User management routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Order management routes
router.route('/orders')
  .get(getOrders);

router.route('/orders/:id')
  .get(getOrder);

router.route('/orders/:id/status')
  .put(updateOrderStatus);

module.exports = router; 