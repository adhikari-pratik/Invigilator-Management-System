"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Drop the existing table and constraints
		await queryInterface.dropTable("ExamClassrooms");

		// Create the table with correct columns
		await queryInterface.createTable("ExamClassrooms", {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			examId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "Exams",
					key: "id",
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			classroomId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "Classrooms",
					key: "id",
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			requiredInvigilators: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			notes: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});

		// Add unique constraint
		await queryInterface.addConstraint("ExamClassrooms", {
			fields: ["examId", "classroomId"],
			type: "unique",
			name: "unique_exam_classroom",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("ExamClassrooms");
	},
};
