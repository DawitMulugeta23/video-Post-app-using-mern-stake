const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middelware/middelware.auths'); // Make sure this path is correct
const {
  getUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteUserAccount,
  getUserActivity,
  updateUserRole,
  adminDeleteUser,
  getUserByUsername
} = require('../controller/user.controller');

// All user routes are protected
router.use(protect);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/avatar', uploadAvatar);
router.delete('/profile', deleteUserAccount);
router.get('/activity', getUserActivity);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', authorize('admin'), getUserById);
router.put('/:id/role', authorize('admin'), updateUserRole);
router.delete('/:id', authorize('admin'), adminDeleteUser);
router.get('/profile/:username', getUserByUsername);

module.exports = router;