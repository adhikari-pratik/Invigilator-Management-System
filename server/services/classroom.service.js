const { Classroom } = require("../models");
const { Op } = require("sequelize");

/**
 * Create a new classroom
 */
const createClassroom = async (classroomData) => {
	try {
		const classroom = await Classroom.create(classroomData);
		return classroom;
	} catch (error) {
		throw error;
	}
};

/**
 * Get all classrooms with filtering and pagination
 */
const getAllClassrooms = async (filters = {}) => {
	try {
		const {
			page = 1,
			limit = 10,
			search = "",
			status,
			department_id,
			building,
			block,
			has_projector,
			has_computer,
			has_whiteboard,
			min_capacity,
			max_capacity,
		} = filters;

		const whereConditions = [];

		// Status filter - only apply if explicitly provided
		if (status) {
			whereConditions.push({ status });
		}

		// Department filter
		if (department_id) {
			whereConditions.push({ department_id });
		}

		// Building filter
		if (building) {
			whereConditions.push({ building });
		}

		// Block filter
		if (block) {
			whereConditions.push({ block });
		}

		// Equipment filters - only add if they are explicitly set
		if (has_projector !== undefined) {
			whereConditions.push({ has_projector });
		}
		if (has_computer !== undefined) {
			whereConditions.push({ has_computer });
		}
		if (has_whiteboard !== undefined) {
			whereConditions.push({ has_whiteboard });
		}

		// Capacity range filter
		if (min_capacity || max_capacity) {
			whereConditions.push({
				capacity: {
					[Op.between]: [
						min_capacity || 0,
						max_capacity || Number.MAX_SAFE_INTEGER,
					],
				},
			});
		}

		// Search filter
		if (search) {
			whereConditions.push({
				[Op.or]: [
					{ name: { [Op.like]: `%${search}%` } },
					{ room_number: { [Op.like]: `%${search}%` } },
					{ building: { [Op.like]: `%${search}%` } },
					{ block: { [Op.like]: `%${search}%` } },
					{ department_name: { [Op.like]: `%${search}%` } },
				],
			});
		}

		const offset = (page - 1) * limit;

		const { count, rows } = await Classroom.findAndCountAll({
			where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : {},
			order: [["createdAt", "DESC"]],
			limit: parseInt(limit),
			offset: parseInt(offset),
		});

		return {
			classrooms: rows,
			total: count,
			page: parseInt(page),
			totalPages: Math.ceil(count / limit),
		};
	} catch (error) {
		throw error;
	}
};

/**
 * Get classroom by ID
 */
const getClassroomById = async (id) => {
	try {
		const classroom = await Classroom.findByPk(id);
		if (!classroom) {
			throw new Error("Classroom not found");
		}
		return classroom;
	} catch (error) {
		throw error;
	}
};

/**
 * Update classroom
 */
const updateClassroom = async (id, updateData) => {
	try {
		const classroom = await Classroom.findByPk(id);
		if (!classroom) {
			throw new Error("Classroom not found");
		}
		await classroom.update(updateData);
		return classroom;
	} catch (error) {
		throw error;
	}
};

/**
 * Delete classroom
 */
const deleteClassroom = async (id) => {
	try {
		const classroom = await Classroom.findByPk(id);
		if (!classroom) {
			throw new Error("Classroom not found");
		}
		await classroom.destroy();
		return { message: "Classroom deleted successfully" };
	} catch (error) {
		throw error;
	}
};

module.exports = {
	createClassroom,
	getAllClassrooms,
	getClassroomById,
	updateClassroom,
	deleteClassroom,
};
