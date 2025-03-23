const {
	Assignment,
	User,
	Exam,
	Classroom,
	Notification,
	sequelize,
} = require("../models");
const { Op } = require("sequelize");
const { createNotification } = require("./notification.service");

/**
 * Create a new assignment
 */
const createAssignment = async (assignmentData, adminId) => {
	const transaction = await sequelize.transaction();

	try {
		// Create the assignment
		const assignment = await Assignment.create(
			{
				...assignmentData,
				assignedBy: adminId,
			},
			{ transaction }
		);

		// Create notification for the invigilator
		await createNotification(
			{
				userId: assignmentData.invigilatorId,
				title: "New Exam Assignment",
				message:
					"You have been assigned to invigilate an exam. Please check your assignments.",
				type: "assignment",
				relatedId: assignment.id,
			},
			transaction
		);

		await transaction.commit();

		return await Assignment.findByPk(assignment.id, {
			include: [
				{
					model: User,
					as: "invigilator",
					attributes: ["id", "fullName", "username", "email"],
				},
				{
					model: Exam,
					as: "exam",
				},
				{
					model: Classroom,
					as: "classroom",
				},
				{
					model: User,
					as: "assigner",
					attributes: ["id", "fullName", "username"],
				},
			],
		});
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

/**
 * Get all assignments with filtering and pagination
 */
const getAllAssignments = async (query = {}) => {
	const {
		page = 1,
		limit = 10,
		status,
		examId,
		invigilatorId,
		search,
		sortBy = "createdAt",
		sortOrder = "DESC",
	} = query;

	const offset = (page - 1) * limit;
	const whereConditions = {};

	// Handle multiple statuses
	if (status !== undefined && status !== "") {
		if (status.includes(",")) {
			whereConditions.status = {
				[Op.in]: status.split(","),
			};
		} else {
			whereConditions.status = status;
		}
	}

	if (examId) {
		whereConditions.examId = examId;
	}

	if (invigilatorId) {
		whereConditions.invigilatorId = invigilatorId;
	}

	const { count, rows } = await Assignment.findAndCountAll({
		where: whereConditions,
		include: [
			{
				model: User,
				as: "invigilator",
				attributes: ["id", "fullName", "username", "email"],
				where: search
					? {
							[Op.or]: [
								{ fullName: { [Op.like]: `%${search}%` } },
								{ username: { [Op.like]: `%${search}%` } },
								{ email: { [Op.like]: `%${search}%` } },
							],
					  }
					: {},
			},
			{
				model: Exam,
				as: "exam",
				where: search
					? {
							[Op.or]: [{ title: { [Op.like]: `%${search}%` } }],
					  }
					: {},
			},
			{
				model: Classroom,
				as: "classroom",
			},
			{
				model: User,
				as: "assigner",
				attributes: ["id", "fullName", "username"],
			},
		],
		limit: parseInt(limit),
		offset,
		order: [[sortBy, sortOrder]],
		distinct: true,
	});

	// Filter out assignments where the exam date has passed
	const currentDate = new Date();
	currentDate.setHours(0, 0, 0, 0); // Set to start of day for accurate date comparison
	const filteredAssignments = rows.filter((assignment) => {
		if (!assignment.exam?.date) return false;
		const examDate = new Date(assignment.exam.date);
		examDate.setHours(0, 0, 0, 0); // Set to start of day for accurate date comparison
		return examDate >= currentDate;
	});

	return {
		assignments: filteredAssignments,
		totalAssignments: filteredAssignments.length,
		totalPages: Math.ceil(filteredAssignments.length / limit),
		currentPage: parseInt(page),
	};
};

/**
 * Get assignment by ID
 */
const getAssignmentById = async (assignmentId) => {
	const assignment = await Assignment.findByPk(assignmentId, {
		include: [
			{
				model: User,
				as: "invigilator",
				attributes: [
					"id",
					"fullName",
					"username",
					"email",
					"gender",
					"phoneNumber",
				],
			},
			{
				model: Exam,
				as: "exam",
			},
			{
				model: Classroom,
				as: "classroom",
			},
			{
				model: User,
				as: "assigner",
				attributes: ["id", "fullName", "username"],
			},
		],
	});

	if (!assignment) {
		throw new Error("Assignment not found");
	}

	return assignment;
};

/**
 * Update assignment status
 */
const updateAssignmentStatus = async (
	assignmentId,
	status,
	responseNote,
	userId
) => {
	const transaction = await sequelize.transaction();

	try {
		const assignment = await Assignment.findByPk(assignmentId, {
			include: [
				{
					model: User,
					as: "invigilator",
				},
				{
					model: Exam,
					as: "exam",
				},
			],
		});

		if (!assignment) {
			throw new Error("Assignment not found");
		}

		// Check if the user is the assigned invigilator
		if (assignment.invigilatorId !== userId) {
			throw new Error("You are not authorized to update this assignment");
		}

		// Update assignment
		assignment.status = status;
		assignment.responseNote = responseNote || null;
		assignment.responseTime = new Date();
		await assignment.save({ transaction });

		// Create notification for admin
		await createNotification(
			{
				userId: assignment.assignedBy,
				title: `Assignment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
				message: `${assignment.invigilator.fullName} has ${status} the assignment for exam: ${assignment.exam.title}`,
				type: "assignment",
				relatedId: assignment.id,
			},
			transaction
		);

		await transaction.commit();

		return assignment;
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

/**
 * Delete assignment
 */
const deleteAssignment = async (assignmentId) => {
	const assignment = await Assignment.findByPk(assignmentId);

	if (!assignment) {
		throw new Error("Assignment not found");
	}

	// Create notification for the invigilator
	await createNotification({
		userId: assignment.invigilatorId,
		title: "Assignment Cancelled",
		message: "Your exam assignment has been cancelled.",
		type: "assignment",
		relatedId: assignment.id,
	});

	await assignment.destroy();

	return { message: "Assignment deleted successfully" };
};

/**
 * Get assignments for invigilator
 */
const getInvigilatorAssignments = async (invigilatorId, query = {}) => {
	const {
		page = 1,
		limit = 10,
		status,
		sortBy = "createdAt",
		sortOrder = "DESC",
	} = query;

	const offset = (page - 1) * limit;
	const whereConditions = { invigilatorId };

	if (status) {
		whereConditions.status = status;
	}

	const { count, rows } = await Assignment.findAndCountAll({
		where: whereConditions,
		include: [
			{
				model: Exam,
				as: "exam",
			},
			{
				model: Classroom,
				as: "classroom",
			},
			{
				model: User,
				as: "assigner",
				attributes: ["id", "fullName", "username"],
			},
		],
		limit: parseInt(limit),
		offset,
		order: [[sortBy, sortOrder]],
	});

	return {
		assignments: rows,
		totalAssignments: count,
		totalPages: Math.ceil(count / limit),
		currentPage: parseInt(page),
	};
};

module.exports = {
	createAssignment,
	getAllAssignments,
	getAssignmentById,
	updateAssignmentStatus,
	deleteAssignment,
	getInvigilatorAssignments,
};
