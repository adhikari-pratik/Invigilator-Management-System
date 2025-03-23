const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Admin routes
router.get(
  '/',
  authMiddleware.restrictTo('admin'),
  userController.getAllUsers
);

router.get(
  '/:id',
  authMiddleware.restrictTo('admin'),
  userController.getUserById
);

router.patch(
  '/:id/status',
  authMiddleware.restrictTo('admin'),
  authMiddleware.auditActivity('update_user_status', 'user'),
  userController.updateUserStatus
);

router.patch(
  '/:id',
  authMiddleware.restrictTo('admin'),
  authMiddleware.auditActivity('update_user', 'user'),
  userController.adminUpdateUser
);

// User routes (for both admin and invigilator)
router.patch(
  '/update-profile',
  authMiddleware.auditActivity('update_profile', 'user'),
  userController.updateProfile
);

module.exports = router;