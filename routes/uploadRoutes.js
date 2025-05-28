const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  res.json({
    success: true,
    file: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private/Admin
router.post('/multiple', protect, authorize('admin'), upload.array('images', 5), (req, res) => {
  const files = req.files.map(file => ({
    filename: file.filename,
    path: `/uploads/${file.filename}`,
    size: file.size,
    mimetype: file.mimetype
  }));

  res.json({
    success: true,
    files
  });
});

module.exports = router; 