const express = require('express');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

router.get('/', notificationController.getUserNotifications);
router.patch('/:id/read', notificationController.markNotificationAsRead);
router.patch('/mark-all-read', notificationController.markAllNotificationsAsRead);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;