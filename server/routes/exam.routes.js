const express = require('express');
const examController = require('../controllers/exam.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Routes accessible by both admin and invigilator
router.get('/', examController.getAllExams);
router.get('/:id', examController.getExamById);

// Admin only routes
router.post(
  '/',
  authMiddleware.restrictTo('admin'),
  authMiddleware.auditActivity('create_exam', 'exam'),
  examController.createExam
);

router.patch(
  '/:id',
  authMiddleware.restrictTo('admin'),
  authMiddleware.auditActivity('update_exam', 'exam'),
  examController.updateExam
);

router.delete(
  '/:id',
  authMiddleware.restrictTo('admin'),
  authMiddleware.auditActivity('delete_exam', 'exam'),
  examController.deleteExam
);

router.patch(
  '/:id/status',
  authMiddleware.restrictTo('admin'),
  authMiddleware.auditActivity('update_exam_status', 'exam'),
  examController.updateExamStatus
);

module.exports = router;