const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroom.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

// Get all classrooms with filtering and pagination
router.get("/", classroomController.getAllClassrooms);

// Get classroom by ID
router.get("/:id", classroomController.getClassroomById);

// Create new classroom
router.post("/", classroomController.createClassroom);

// Update classroom
router.put("/:id", classroomController.updateClassroom);

// Delete classroom
router.delete("/:id", classroomController.deleteClassroom);

module.exports = router;
