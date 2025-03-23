const userService = require('../services/user.service');

/**
 * Get all users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status
 */
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid status (pending, approved, rejected)',
      });
    }
    
    const user = await userService.updateUserStatus(req.params.id, status, req.user.id);
    
    res.status(200).json({
      status: 'success',
      message: `User status updated to ${status}`,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin update user profile
 */
exports.adminUpdateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUserProfile(req.params.id, req.body);
    
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};