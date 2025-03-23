const {
	Exam,
	ExamClassroom,
	Classroom,
	User,
	Assignment,
	sequelize,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Create a new exam
 */
const createExam = async (examData, userId) => {
	const transaction = await sequelize.transaction();

	try {
		// Create the exam
		const exam = await Exam.create(
			{
				...examData,
				createdBy: userId,
			},
			{ transaction }
		);

		// If classrooms are specified, create exam-classroom associations
		if (examData.classrooms && examData.classrooms.length > 0) {
			const examClassrooms = examData.classrooms.map((classroom) => ({
				examId: exam.id,
				classroomId: classroom.classroomId,
				requiredInvigilators: classroom.requiredInvigilators || 1,
				notes: classroom.notes || null,
			}));

			await ExamClassroom.bulkCreate(examClassrooms, { transaction });
		}

		await transaction.commit();

		return await Exam.findByPk(exam.id, {
			include: [
				{
					model: Classroom,
					as: "classrooms",
					through: { attributes: ["requiredInvigilators", "notes"] },
				},
				{
					model: User,
					as: "creator",
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
 * Get all exams with filtering and pagination
 */
const getAllExams = async (query = {}) => {
	const {
		page = 1,
		limit = 10,
		status,
		date,
		search,
		sortBy = "date",
		sortOrder = "DESC",
	} = query;

	const offset = (page - 1) * limit;
	const whereConditions = {};

	if (status) {
		whereConditions.status = status;
	}

	if (date) {
		whereConditions.date = date;
	}

	if (search) {
		whereConditions[Op.or] = [
			{ title: { [Op.like]: `%${search}%` } },
			{ description: { [Op.like]: `%${search}%` } },
		];
	}

	const { count, rows } = await Exam.findAndCountAll({
		where: whereConditions,
		include: [
			{
				model: User,
				as: "creator",
				attributes: ["id", "fullName", "username"],
			},
			{
				model: Classroom,
				as: "classrooms",
				through: { attributes: ["requiredInvigilators"] },
			},
			{
				model: Assignment,
				as: "assignments",
				include: [
					{
						model: User,
						as: "invigilator",
						attributes: ["id", "fullName", "username", "email", "gender"],
					},
					{
						model: Classroom,
						as: "classroom",
					},
				],
			},
		],
		limit: parseInt(limit),
		offset,
		order: [[sortBy, sortOrder]],
		distinct: true,
	});

	return {
		exams: rows,
		totalExams: count,
		totalPages: Math.ceil(count / limit),
		currentPage: parseInt(page),
	};
};

/**
 * Get exam by ID
 */
const getExamById = async (examId) => {
	const exam = await Exam.findByPk(examId, {
		include: [
			{
				model: Classroom,
				as: "classrooms",
				through: { attributes: ["requiredInvigilators", "notes"] },
			},
			{
				model: User,
				as: "creator",
				attributes: ["id", "fullName", "username"],
			},
			{
				model: Assignment,
				as: "assignments",
				include: [
					{
						model: User,
						as: "invigilator",
						attributes: ["id", "fullName", "username", "email", "gender"],
					},
					{
						model: Classroom,
						as: "classroom",
					},
				],
			},
		],
	});

	if (!exam) {
		throw new Error("Exam not found");
	}

	return exam;
};

/**
 * Update exam
 */
const updateExam = async (examId, examData) => {
	const transaction = await sequelize.transaction();

	try {
		const exam = await Exam.findByPk(examId);

		if (!exam) {
			throw new Error("Exam not found");
		}

		// Update exam data
		await exam.update(examData, { transaction });

		// If classrooms are specified, update exam-classroom associations
		if (examData.classrooms) {
			// Delete existing associations
			await ExamClassroom.destroy({
				where: { examId },
				transaction,
			});

			// Create new associations
			const examClassrooms = examData.classrooms.map((classroom) => ({
				examId,
				classroomId: classroom.classroomId,
				requiredInvigilators: classroom.requiredInvigilators || 1,
				notes: classroom.notes || null,
			}));

			await ExamClassroom.bulkCreate(examClassrooms, { transaction });
		}

		await transaction.commit();

		return await getExamById(examId);
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
};

/**
 * Delete exam
 */
const deleteExam = async (examId) => {
	const exam = await Exam.findByPk(examId);

	if (!exam) {
		throw new Error("Exam not found");
	}

	// Check if there are assignments for this exam
	const assignmentsCount = await Assignment.count({ where: { examId } });

	if (assignmentsCount > 0) {
		throw new Error("Cannot delete exam with existing assignments");
	}

	// Delete exam-classroom associations
	await ExamClassroom.destroy({ where: { examId } });

	// Delete exam
	await exam.destroy();

	return { message: "Exam deleted successfully" };
};

/**
 * Update exam status
 */
const updateExamStatus = async (examId, status) => {
	const exam = await Exam.findByPk(examId);

	if (!exam) {
		throw new Error("Exam not found");
	}

	exam.status = status;
	await exam.save();

	return exam;
};

module.exports = {
	createExam,
	getAllExams,
	getExamById,
	updateExam,
	deleteExam,
	updateExamStatus,
};
