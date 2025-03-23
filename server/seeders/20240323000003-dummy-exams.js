"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		const examTitles = [
			"Data Structures and Algorithms",
			"Database Management Systems",
			"Computer Networks",
			"Operating Systems",
			"Software Engineering",
			"Digital Electronics",
			"Computer Architecture",
			"Machine Learning",
			"Web Development",
			"Mobile Application Development",
		];

		const descriptions = [
			"Final examination covering fundamental data structures and algorithms",
			"Comprehensive test on database design and SQL",
			"Network protocols and architecture examination",
			"Operating system concepts and implementation",
			"Software development lifecycle and methodologies",
			"Digital circuit design and implementation",
			"Computer organization and architecture principles",
			"Machine learning algorithms and applications",
			"Modern web development technologies and frameworks",
			"Mobile app development and design patterns",
		];

		const exams = [];

		// Get current date
		const now = new Date();
		const currentYear = now.getFullYear();

		// Generate 10 exams
		for (let i = 0; i < 10; i++) {
			// Generate random date within the current year
			const randomDate = new Date(
				currentYear,
				Math.floor(Math.random() * 12),
				Math.floor(Math.random() * 28) + 1
			);

			// Generate random start time (between 9 AM and 2 PM)
			const startHour = Math.floor(Math.random() * 5) + 9; // 9-13
			const startTime = `${startHour.toString().padStart(2, "0")}:00`;

			// End time is 2-3 hours after start time
			const duration = Math.floor(Math.random() * 2) + 2; // 2-3 hours
			const endHour = startHour + duration;
			const endTime = `${endHour.toString().padStart(2, "0")}:00`;

			// Determine status based on date
			let status;
			if (randomDate < now) {
				// Past date
				status = Math.random() > 0.2 ? "completed" : "cancelled"; // 80% completed, 20% cancelled
			} else {
				// Future date
				status = "scheduled";
			}

			exams.push({
				id: `${i + 1}-${Math.random().toString(36).substr(2, 9)}`,
				title: examTitles[i],
				description: descriptions[i],
				date: randomDate,
				startTime: startTime,
				endTime: endTime,
				duration: duration * 60, // Convert hours to minutes
				status: status,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		// Insert exams
		await queryInterface.bulkInsert("Exams", exams, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Exams", null, {});
	},
};
