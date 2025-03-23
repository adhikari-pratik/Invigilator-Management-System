const assignmentService = require('../services/assignment.service');

/**
 * Create a new assignment
 */
exports.createAssignment = async (req, res, next) => {
  try {
    const assignment = await assignmentService.createAssignment(req.body, req.user.id);
    
    res.status(201).json({
      status: 'success',
      message: 'Assignment created successfully',
      data: {
        assignment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all assignments
 */
exports.getAllAssignments = async (req, res, next) => {
  try {
    const result = await assignmentService.getAllAssignments(req.query);
    
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get assignment by ID
 */
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await assignmentService.getAssignmentById(req.params.id);
    
    res.status(200).json({
      status: 'success',
      data: {
        assignment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update assignment status
 */
exports.updateAssignmentStatus = async (req, res, next) => {
  try {
    const { status, responseNote } = req.body;
    
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid status (accepted, rejected)',
      });
    }
    
    const assignment = await assignmentService.updateAssignmentStatus(
      req.params.id,
      status,
      responseNote,
      req.user.id
    );
    
    res.status(200).json({
      status: 'success',
      message: `Assignment ${status} successfully`,
      data: {
        assignment,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete assignment
 */
exports.deleteAssignment = async (req, res, next) => {
  try {
    const result = await assignmentService.deleteAssignment(req.params.id);
    
    res.status(200).json({
      status: 'success',
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get assignments for invigilator
 */
exports.getInvigilatorAssignments = async (req, res, next) => {
  try {
    const result = await assignmentService.getInvigilatorAssignments(req.user.id, req.query);
    
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};