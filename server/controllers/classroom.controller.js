const classroomService = require("../services/classroom.service");

/**
 * Create a new classroom
 */
const createClassroom = async (req, res) => {
	try {
		const classroom = await classroomService.createClassroom(req.body);
		res.status(201).json(classroom);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

/**
 * Get all classrooms
 */
const getAllClassrooms = async (req, res) => {
	try {
		const filters = {
			page: req.query.page || 1,
			limit: req.query.limit || 10,
			search: req.query.search,
			status: req.query.status,
			department_id: req.query.department_id,
			building: req.query.building,
			block: req.query.block,
			has_projector:
				req.query.has_projector === "true"
					? true
					: req.query.has_projector === "false"
					? false
					: undefined,
			has_computer:
				req.query.has_computer === "true"
					? true
					: req.query.has_computer === "false"
					? false
					: undefined,
			has_whiteboard:
				req.query.has_whiteboard === "true"
					? true
					: req.query.has_whiteboard === "false"
					? false
					: undefined,
			min_capacity: req.query.min_capacity,
			max_capacity: req.query.max_capacity,
		};

		const result = await classroomService.getAllClassrooms(filters);
		res.json({
			classrooms: result.classrooms,
			page: result.page,
			totalPages: result.totalPages,
			total: result.total,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

/**
 * Get classroom by ID
 */
const getClassroomById = async (req, res) => {
	try {
		const classroom = await classroomService.getClassroomById(req.params.id);
		res.json(classroom);
	} catch (error) {
		if (error.message === "Classroom not found") {
			res.status(404).json({ message: error.message });
		} else {
			res.status(500).json({ message: error.message });
		}
	}
};

/**
 * Update classroom
 */
const updateClassroom = async (req, res) => {
	try {
		const classroom = await classroomService.updateClassroom(
			req.params.id,
			req.body
		);
		res.json(classroom);
	} catch (error) {
		if (error.message === "Classroom not found") {
			res.status(404).json({ message: error.message });
		} else {
			res.status(500).json({ message: error.message });
		}
	}
};

/**
 * Delete classroom
 */
const deleteClassroom = async (req, res) => {
	try {
		const result = await classroomService.deleteClassroom(req.params.id);
		res.json(result);
	} catch (error) {
		if (error.message === "Classroom not found") {
			res.status(404).json({ message: error.message });
		} else {
			res.status(500).json({ message: error.message });
		}
	}
};

module.exports = {
	createClassroom,
	getAllClassrooms,
	getClassroomById,
	updateClassroom,
	deleteClassroom,
};
