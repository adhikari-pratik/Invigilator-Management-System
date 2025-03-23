"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Drop the existing ExamClassrooms table
		await queryInterface.dropTable("ExamClassrooms");

		// Recreate the ExamClassrooms table with correct columns
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
			},
			classroomId: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: "Classrooms",
					key: "id",
				},
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

		// Add unique index
		await queryInterface.addIndex("ExamClassrooms", ["examId", "classroomId"], {
			unique: true,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("ExamClassrooms");
	},
};
