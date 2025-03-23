const statsService = require('../services/stats.service');

/**
 * Get system statistics
 */
exports.getSystemStats = async (req, res, next) => {
  try {
    const stats = await statsService.getSystemStats();
    
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get invigilator statistics
 */
exports.getInvigilatorStats = async (req, res, next) => {
  try {
    const stats = await statsService.getInvigilatorStats(req.user.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly exam statistics
 */
exports.getMonthlyExamStats = async (req, res, next) => {
  try {
    const { year } = req.query;
    const stats = await statsService.getMonthlyExamStats(year);
    
    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};