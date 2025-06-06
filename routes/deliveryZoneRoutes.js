const express = require('express');
const router = express.Router();
const {
  getAllDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone
} = require('../controllers/deliveryZoneController');

// Public routes
router.get('/', getAllDeliveryZones);
// Admin routes
router.post('/', createDeliveryZone);
router.put('/:id', updateDeliveryZone);
router.delete('/:id', deleteDeliveryZone);

module.exports = router; 