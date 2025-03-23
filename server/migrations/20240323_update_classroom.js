"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Classrooms", "location");
		await queryInterface.removeColumn("Classrooms", "isActive");
		await queryInterface.removeColumn("Classrooms", "description");

		await queryInterface.addColumn("Classrooms", "room_number", {
			type: Sequelize.STRING(50),
			allowNull: false,
			unique: true,
		});

		await queryInterface.addColumn("Classrooms", "building", {
			type: Sequelize.STRING,
			allowNull: false,
		});

		await queryInterface.addColumn("Classrooms", "floor", {
			type: Sequelize.INTEGER,
			allowNull: false,
		});

		await queryInterface.addColumn("Classrooms", "has_projector", {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		});

		await queryInterface.addColumn("Classrooms", "has_computer", {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
		});

		await queryInterface.addColumn("Classrooms", "has_whiteboard", {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
		});

		await queryInterface.addColumn("Classrooms", "status", {
			type: Sequelize.ENUM("active", "inactive"),
			defaultValue: "active",
		});

		await queryInterface.addColumn("Classrooms", "block", {
			type: Sequelize.STRING(10),
			allowNull: false,
		});

		await queryInterface.addColumn("Classrooms", "department_id", {
			type: Sequelize.INTEGER,
			allowNull: false,
		});

		await queryInterface.addColumn("Classrooms", "department_name", {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Classrooms", "room_number");
		await queryInterface.removeColumn("Classrooms", "building");
		await queryInterface.removeColumn("Classrooms", "floor");
		await queryInterface.removeColumn("Classrooms", "has_projector");
		await queryInterface.removeColumn("Classrooms", "has_computer");
		await queryInterface.removeColumn("Classrooms", "has_whiteboard");
		await queryInterface.removeColumn("Classrooms", "status");
		await queryInterface.removeColumn("Classrooms", "block");
		await queryInterface.removeColumn("Classrooms", "department_id");
		await queryInterface.removeColumn("Classrooms", "department_name");

		await queryInterface.addColumn("Classrooms", "location", {
			type: Sequelize.STRING,
			allowNull: false,
		});

		await queryInterface.addColumn("Classrooms", "isActive", {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
		});

		await queryInterface.addColumn("Classrooms", "description", {
			type: Sequelize.TEXT,
			allowNull: true,
		});
	},
};
