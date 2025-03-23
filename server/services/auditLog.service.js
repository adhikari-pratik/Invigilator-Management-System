const { AuditLog } = require('../models');

/**
 * Create a new audit log entry
 */
const createAuditLog = async (logData) => {
  const log = await AuditLog.create(logData);
  return log;
};

/**
 * Get all audit logs with filtering and pagination
 */
const getAuditLogs = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    userId,
    action,
    resourceType,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'DESC',
  } = query;
  
  const offset = (page - 1) * limit;
  const whereConditions = {};
  
  if (userId) {
    whereConditions.userId = userId;
  }
  
  if (action) {
    whereConditions.action = action;
  }
  
  if (resourceType) {
    whereConditions.resourceType = resourceType;
  }
  
  if (startDate && endDate) {
    whereConditions.createdAt = {
      [Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    whereConditions.createdAt = {
      [Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    whereConditions.createdAt = {
      [Op.lte]: new Date(endDate),
    };
  }
  
  const { count, rows } = await AuditLog.findAndCountAll({
    where: whereConditions,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'username', 'role'],
      },
    ],
    limit: parseInt(limit),
    offset,
    order: [[sortBy, sortOrder]],
  });
  
  return {
    logs: rows,
    totalLogs: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
  };
};

module.exports = {
  createAuditLog,
  getAuditLogs,
};