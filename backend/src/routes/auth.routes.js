const express = require('express');
const router = express.Router();
const { protect } = require('../middelware/auth.middleware');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controller/auth.controller');

// REMOVED: verifyEmail routes

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout); // Changed to POST and added protect

module.exports = router;