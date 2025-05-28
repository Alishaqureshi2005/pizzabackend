const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDeliveryAddresses,
  addDeliveryAddress,
  updateDeliveryAddress,
  deleteDeliveryAddress,
  setDefaultAddress,
  resetDeliveryAddresses
} = require('../controllers/deliveryAddressController');

// All routes are protected
router.use(protect);

router
  .route('/')
  .get(getDeliveryAddresses)
  .post(addDeliveryAddress);

router
  .route('/:id')
  .put(updateDeliveryAddress)
  .delete(deleteDeliveryAddress);

router
  .route('/:id/default')
  .put(setDefaultAddress);

// Reset all addresses
router.delete('/reset', resetDeliveryAddresses);

module.exports = router; 