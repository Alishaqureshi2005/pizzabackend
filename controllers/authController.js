const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const config = require('../config/config');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Log the incoming request body
    console.log('Registration request body:', req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    const { name, email, password, confirmPassword, phone } = req.body;

    // Log the extracted data
    console.log('Extracted data:', { name, email, phone });

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        errors: [{
          field: 'email',
          message: 'This email is already registered'
        }]
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
console.log(req.body)
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    console.log(user)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [{
          field: 'email',
          message: 'No account found with this email'
        }]
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [{
          field: 'password',
          message: 'Incorrect password'
        }]
      });
    }
console.log(isMatch)
    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    console.log(token)
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Check if user exists in request
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    // Get fresh user data from database
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user details',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
        errors: [{
          field: 'currentPassword',
          message: 'Current password is incorrect'
        }]
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}; 