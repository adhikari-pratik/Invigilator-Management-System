"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
	async up(queryInterface, Sequelize) {
		const buildings = [
			"Main Building",
			"Engineering Block",
			"Science Block",
			"Administration Block",
			"Library Block",
			"Computer Center",
			"Research Center",
			"Innovation Hub",
		];

		const blocks = ["A", "B", "C", "D", "E", "F", "G", "H"];

		const departments = [
			{ id: 1, name: "Computer Engineering" },
			{ id: 2, name: "Civil Engineering" },
			{ id: 3, name: "Mechanical Engineering" },
			{ id: 4, name: "Electrical Engineering" },
			{ id: 5, name: "Electronics Engineering" },
			{ id: 6, name: "Architecture" },
			{ id: 7, name: "Applied Sciences" },
			{ id: 8, name: "Management" },
			{ id: 9, name: "Humanities" },
		];

		const classrooms = [];

		// Generate 70 classrooms
		for (let i = 0; i < 70; i++) {
			const building = buildings[i % buildings.length];
			const block = blocks[i % blocks.length];
			const department = departments[i % departments.length];
			const floor = Math.floor(Math.random() * 5); // 0-4 floors
			const roomNumber = `${block}${floor}${(i % 10) + 1}${Math.floor(
				Math.random() * 100
			)}`; // Make room numbers unique
			const capacity = Math.floor(Math.random() * 30) + 30; // 30-60 students
			const hasProjector = Math.random() > 0.3; // 70% chance of having projector
			const hasComputer = Math.random() > 0.4; // 60% chance of having computer
			const hasWhiteboard = Math.random() > 0.1; // 90% chance of having whiteboard
			const status = Math.random() > 0.1 ? "active" : "inactive"; // 90% chance of being active

			classrooms.push({
				id: uuidv4(),
				name: `${building} ${roomNumber}`,
				room_number: roomNumber,
				building: building,
				capacity: capacity,
				floor: floor,
				has_projector: hasProjector,
				has_computer: hasComputer,
				has_whiteboard: hasWhiteboard,
				status: status,
				block: block,
				department_id: department.id,
				department_name: department.name,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		// Insert classrooms in batches to avoid overwhelming the database
		const batchSize = 20;
		for (let i = 0; i < classrooms.length; i += batchSize) {
			const batch = classrooms.slice(i, i + batchSize);
			await queryInterface.bulkInsert("Classrooms", batch, {});
		}
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Classrooms", null, {});
	},
};
