"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.removeColumn("Users", "distance_from_patandhoka");
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn("Users", "distance_from_patandhoka", {
			type: Sequelize.DECIMAL(5, 2),
			allowNull: true,
			comment: "Distance from Patan Dhoka in kilometers",
		});
	},
};
