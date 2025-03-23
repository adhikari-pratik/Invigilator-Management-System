const express = require("express");
const assignmentController = require("../controllers/assignment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Admin routes
router.post(
	"/",
	authMiddleware.restrictTo("admin"),
	authMiddleware.auditActivity("create_assignment", "assignment"),
	assignmentController.createAssignment
);

router.get(
	"/",
	authMiddleware.restrictTo("admin"),
	assignmentController.getAllAssignments
);

// Invigilator routes
router.get(
	"/my-assignments",
	authMiddleware.restrictTo("invigilator"),
	assignmentController.getInvigilatorAssignments
);

// Common routes
router.get("/:id", assignmentController.getAssignmentById);

router.delete(
	"/:id",
	authMiddleware.restrictTo("admin"),
	authMiddleware.auditActivity("delete_assignment", "assignment"),
	assignmentController.deleteAssignment
);

router.patch(
	"/:id/status",
	authMiddleware.restrictTo("invigilator"),
	authMiddleware.auditActivity("update_assignment_status", "assignment"),
	assignmentController.updateAssignmentStatus
);

module.exports = router;
