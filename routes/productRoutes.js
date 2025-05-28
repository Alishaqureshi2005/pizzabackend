const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, authorize('admin'), upload.single('image'), handleMulterError, createProduct);
router.put('/:id', protect, authorize('admin'), upload.single('image'), handleMulterError, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router; 