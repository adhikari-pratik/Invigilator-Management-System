const { Notification } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new notification
 */
const createNotification = async (notificationData, transaction = null) => {
  const notification = await Notification.create(notificationData, {
    transaction: transaction || null,
  });
  return notification;
};

/**
 * Get notifications for a user
 */
const getUserNotifications = async (userId, query = {}) => {
  const {
    page = 1,
    limit = 10,
    isRead,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
  } = query;
  
  const offset = (page - 1) * limit;
  const whereConditions = { userId };
  
  if (isRead !== undefined) {
    whereConditions.isRead = isRead === 'true';
  }
  
  const { count, rows } = await Notification.findAndCountAll({
    where: whereConditions,
    limit: parseInt(limit),
    offset,
    order: [[sortBy, sortOrder]],
  });
  
  return {
    notifications: rows,
    totalNotifications: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    unreadCount: await Notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
  };
};

/**
 * Mark notification as read
 */
const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      userId,
    },
  });
  
  if (!notification) {
    throw new Error('Notification not found');
  }
  
  notification.isRead = true;
  await notification.save();
  
  return notification;
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsAsRead = async (userId) => {
  await Notification.update(
    { isRead: true },
    {
      where: {
        userId,
        isRead: false,
      },
    }
  );
  
  return { message: 'All notifications marked as read' };
};

/**
 * Delete notification
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    where: {
      id: notificationId,
      userId,
    },
  });
  
  if (!notification) {
    throw new Error('Notification not found');
  }
  
  await notification.destroy();
  
  return { message: 'Notification deleted successfully' };
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};