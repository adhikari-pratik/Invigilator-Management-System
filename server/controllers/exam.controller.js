const examService = require('../services/exam.service');

/**
 * Create a new exam
 */
exports.createExam = async (req, res, next) => {
  try {
    const exam = await examService.createExam(req.body, req.user.id);
    
    res.status(201).json({
      status: 'success',
      message: 'Exam created successfully',
      data: {
        exam,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all exams
 */
exports.getAllExams = async (req, res, next) => {
  try {
    const result = await examService.getAllExams(req.query);
    
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get exam by ID
 */
exports.getExamById = async (req, res, next) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        exam,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update exam
 */
exports.updateExam = async (req, res, next) => {
  try {
    const exam = await examService.updateExam(req.params.id, req.body);
    
    res.status(200).json({
      status: 'success',
      message: 'Exam updated successfully',
      data: {
        exam,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete exam
 */
exports.deleteExam = async (req, res, next) => {
  try {
    const result = await examService.deleteExam(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update exam status
 */
exports.updateExamStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['scheduled', 'ongoing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid status (scheduled, ongoing, completed, cancelled)',
      });
    }
    
    const exam = await examService.updateExamStatus(req.params.id, status);
    
    res.status(200).json({
      status: 'success',
      message: `Exam status updated to ${status}`,
      data: {
        exam,
      },
    });
  } catch (error) {
    next(error);
  }
};