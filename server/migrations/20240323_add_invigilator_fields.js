"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Users", "distance_from_patandhoka", {
			type: Sequelize.DECIMAL(5, 2),
			allowNull: true,
			comment: "Distance from Patan Dhoka in kilometers",
		});

		await queryInterface.addColumn("Users", "designation", {
			type: Sequelize.STRING,
			allowNull: true,
			comment: "Role/position of the invigilator",
		});

		await queryInterface.addColumn("Users", "experience_years", {
			type: Sequelize.INTEGER,
			allowNull: true,
			comment: "Years of invigilation experience",
		});

		await queryInterface.addColumn("Users", "specialization", {
			type: Sequelize.STRING,
			allowNull: true,
			comment: "Area of expertise",
		});

		await queryInterface.addColumn("Users", "max_duties_per_day", {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 2,
			comment: "Maximum number of duties allowed per day",
		});

		await queryInterface.addColumn("Users", "max_duties_per_week", {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 8,
			comment: "Maximum number of duties allowed per week",
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Users", "distance_from_patandhoka");
		await queryInterface.removeColumn("Users", "designation");
		await queryInterface.removeColumn("Users", "experience_years");
		await queryInterface.removeColumn("Users", "specialization");
		await queryInterface.removeColumn("Users", "max_duties_per_day");
		await queryInterface.removeColumn("Users", "max_duties_per_week");
	},
};
