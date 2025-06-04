const express = require('express');
const router = express.Router();
const {
  getAllDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  getDeliveryFee
} = require('../controllers/deliveryZoneController');

// Public routes
router.get('/', getAllDeliveryZones);
router.post('/get-delivery-fee', getDeliveryFee);

// Admin routes
router.post('/', createDeliveryZone);
router.put('/:id', updateDeliveryZone);
router.delete('/:id', deleteDeliveryZone);

module.exports = router; 