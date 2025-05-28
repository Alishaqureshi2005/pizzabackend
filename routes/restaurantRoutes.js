const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getRestaurants,
  getNearestRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require('../controllers/restaurantLocationController');

// Public routes
router.get('/', getRestaurants);
router.get('/nearest', getNearestRestaurant);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .post(createRestaurant);

router
  .route('/:id')
  .put(updateRestaurant)
  .delete(deleteRestaurant);

module.exports = router; 