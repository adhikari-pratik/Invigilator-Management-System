const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/auth');
const { createAuditLog } = require('../services/auditLog.service');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Check if user still exists
    const currentUser = await User.findByPk(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (currentUser.status !== 'approved') {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account is not approved yet.',
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token or session expired.',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

exports.auditActivity = (action, resourceType) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      const statusCode = res.statusCode.toString();
      
      // Log successful operations (2xx status codes)
      if (statusCode.startsWith('2')) {
        const resourceId = req.params.id || null;
        const details = {
          method: req.method,
          path: req.path,
          body: req.method !== 'GET' ? req.body : undefined,
          statusCode: res.statusCode,
        };
        
        try {
          createAuditLog({
            userId: req.user.id,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress: req.ip,
          });
        } catch (err) {
          console.error('Error creating audit log:', err);
        }
      }
      
      originalSend.apply(res, arguments);
      return res;
    };
    
    next();
  };
};