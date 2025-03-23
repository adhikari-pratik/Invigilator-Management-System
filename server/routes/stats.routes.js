const express = require('express');
const statsController = require('../controllers/stats.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Admin routes
router.get(
  '/system',
  authMiddleware.restrictTo('admin'),
  statsController.getSystemStats
);

router.get(
  '/monthly-exams',
  authMiddleware.restrictTo('admin'),
  statsController.getMonthlyExamStats
);

// Invigilator routes
router.get(
  '/invigilator',
  authMiddleware.restrictTo('invigilator'),
  statsController.getInvigilatorStats
);

module.exports = router;