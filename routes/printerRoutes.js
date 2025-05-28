const express = require('express');
const router = express.Router();
const {
  getPrinterSettings,
  updatePrinterSettings,
  printTest,
  printOrder
} = require('../controllers/printerController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin access
router.use(protect);
router.use(authorize('admin'));

// Printer settings routes
router.get('/settings', getPrinterSettings);
router.put('/settings', updatePrinterSettings);

// Print routes
router.post('/test', printTest);
router.post('/print', printOrder);

module.exports = router; 