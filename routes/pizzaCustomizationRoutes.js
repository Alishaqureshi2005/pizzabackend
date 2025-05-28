const express = require('express');
const router = express.Router();
const {
  getSizes,
  getCrusts,
  getToppings,
  getExtraItems
} = require('../controllers/pizzaCustomizationController');

// Public routes
router.get('/sizes', getSizes);
router.get('/sizes/:productId', getSizes);
router.get('/crusts', getCrusts);
router.get('/toppings', getToppings);
router.get('/extra-items', getExtraItems);

module.exports = router; 