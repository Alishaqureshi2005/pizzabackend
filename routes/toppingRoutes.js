const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
  getAllToppings,
  getToppingsByType,
  getPopularToppings,
  getVegetarianToppings,
  createTopping,
  updateTopping,
  deleteTopping,
  getTopping
} = require('../controllers/toppingController');

// Public routes
router
  .route('/')
  .get(getAllToppings);

router
  .route('/type/:type')
  .get(getToppingsByType);

router
  .route('/popular')
  .get(getPopularToppings);

router
  .route('/vegetarian')
  .get(getVegetarianToppings);

router
  .route('/:id')
  .get(getTopping);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .post(upload.single('image'), createTopping);

router
  .route('/:id')
  .put(upload.single('image'), updateTopping)
  .delete(deleteTopping);

module.exports = router; 