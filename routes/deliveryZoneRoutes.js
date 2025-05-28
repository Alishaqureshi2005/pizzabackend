const express = require('express');
const router = express.Router();
const {
  getAllDeliveryZones,
  getDeliveryZoneById,
  getTimeSlots,
  updateTimeSlot,
  checkDeliveryAvailability,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  restoreDefaultZones
} = require('../controllers/deliveryZoneController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllDeliveryZones);
router.get('/:id', getDeliveryZoneById);
router.get('/:id/time-slots', getTimeSlots);
router.post('/check-availability', checkDeliveryAvailability);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .post(createDeliveryZone);

router
  .route('/:id')
  .put(updateDeliveryZone)
  .delete(deleteDeliveryZone);

router
  .route('/:id/time-slots/:slotId')
  .put(updateTimeSlot);

router.post('/restore', restoreDefaultZones);

module.exports = router; 