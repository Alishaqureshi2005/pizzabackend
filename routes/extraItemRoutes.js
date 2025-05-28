const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getAllExtraItems,
  getExtraItemsByCategory,
  createExtraItem,
  updateExtraItem,
  deleteExtraItem,
  getExtraItem
} = require('../controllers/extraItemController');

// Public routes
router
  .route('/')
  .get(getAllExtraItems);

router
  .route('/category/:category')
  .get(getExtraItemsByCategory);

router
  .route('/:id')
  .get(getExtraItem);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .post(upload.single('image'), createExtraItem);

router
  .route('/:id')
  .put(upload.single('image'), updateExtraItem)
  .delete(deleteExtraItem);

module.exports = router; 