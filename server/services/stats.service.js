const { User, Exam, Assignment, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * Get system statistics
 */
const getSystemStats = async () => {
  const totalUsers = await User.count();
  const totalInvigilators = await User.count({ where: { role: 'invigilator' } });
  const totalExams = await Exam.count();
  const upcomingExams = await Exam.count({
    where: {
      date: {
        [Op.gte]: new Date(),
      },
      status: 'scheduled',
    },
  });
  const completedExams = await Exam.count({ where: { status: 'completed' } });
  const pendingAssignments = await Assignment.count({ where: { status: 'pending' } });
  const acceptedAssignments = await Assignment.count({ where: { status: 'accepted' } });
  const rejectedAssignments = await Assignment.count({ where: { status: 'rejected' } });
  
  return {
    users: {
      total: totalUsers,
      invigilators: totalInvigilators,
      admins: totalUsers - totalInvigilators,
    },
    exams: {
      total: totalExams,
      upcoming: upcomingExams,
      completed: completedExams,
      ongoing: totalExams - upcomingExams - completedExams,
    },
    assignments: {
      pending: pendingAssignments,
      accepted: acceptedAssignments,
      rejected: rejectedAssignments,
      total: pendingAssignments + acceptedAssignments + rejectedAssignments,
    },
  };
};

/**
 * Get invigilator statistics
 */
const getInvigilatorStats = async (invigilatorId) => {
  const totalAssignments = await Assignment.count({ where: { invigilatorId } });
  const pendingAssignments = await Assignment.count({ where: { invigilatorId, status: 'pending' } });
  const acceptedAssignments = await Assignment.count({ where: { invigilatorId, status: 'accepted' } });
  const rejectedAssignments = await Assignment.count({ where: { invigilatorId, status: 'rejected' } });
  const completedAssignments = await Assignment.count({ where: { invigilatorId, status: 'completed' } });
  
  const upcomingAssignments = await Assignment.count({
    where: { 
      invigilatorId,
      status: 'accepted',
    },
    include: [
      {
        model: Exam,
        as: 'exam',
        where: {
          date: {
            [Op.gte]: new Date(),
          },
        },
      },
    ],
  });
  
  return {
    assignments: {
      total: totalAssignments,
      pending: pendingAssignments,
      accepted: acceptedAssignments,
      rejected: rejectedAssignments,
      completed: completedAssignments,
      upcoming: upcomingAssignments,
    },
  };
};

/**
 * Get monthly exam statistics
 */
const getMonthlyExamStats = async (year = new Date().getFullYear()) => {
  const stats = await Exam.findAll({
    attributes: [
      [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    where: {
      [Op.and]: [
        sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
      ],
    },
    group: [sequelize.fn('MONTH', sequelize.col('date'))],
    raw: true,
  });
  
  const monthlyData = Array(12).fill(0);
  
  stats.forEach(stat => {
    const month = parseInt(stat.month) - 1; // Convert to 0-based index
    monthlyData[month] = parseInt(stat.count);
  });
  
  return {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
    data: monthlyData,
  };
};

module.exports = {
  getSystemStats,
  getInvigilatorStats,
  getMonthlyExamStats,
};