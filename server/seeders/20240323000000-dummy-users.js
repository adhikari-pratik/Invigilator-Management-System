"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
	async up(queryInterface, Sequelize) {
		const hashedPassword = await bcrypt.hash("password123", 10);

		const nepaliNames = [
			{ first: "Ramesh", last: "Karki", gender: "male" },
			{ first: "Sita", last: "Gurung", gender: "female" },
			{ first: "Amit", last: "Lama", gender: "male" },
			{ first: "Priya", last: "Magar", gender: "female" },
			{ first: "Rajesh", last: "Tamang", gender: "male" },
			{ first: "Anita", last: "Sherpa", gender: "female" },
			{ first: "Dinesh", last: "Rai", gender: "male" },
			{ first: "Sunita", last: "Limbu", gender: "female" },
			{ first: "Prakash", last: "Thapa", gender: "male" },
			{ first: "Mina", last: "Khadka", gender: "female" },
			{ first: "Bikash", last: "Basnet", gender: "male" },
			{ first: "Rita", last: "Thapa", gender: "female" },
			{ first: "Krishna", last: "Sharma", gender: "male" },
			{ first: "Sangita", last: "Pandey", gender: "female" },
			{ first: "Hari", last: "Khadka", gender: "male" },
			{ first: "Laxmi", last: "Gurung", gender: "female" },
			{ first: "Narayan", last: "Rai", gender: "male" },
			{ first: "Gita", last: "Magar", gender: "female" },
			{ first: "Ram", last: "Lama", gender: "male" },
			{ first: "Sita", last: "Tamang", gender: "female" },
		];

		const kathmanduAddresses = [
			"Thamel, Kathmandu",
			"Baneshwor, Kathmandu",
			"Lalitpur, Patan",
			"Kirtipur, Kathmandu",
			"Boudha, Kathmandu",
			"Jawalakhel, Lalitpur",
			"Balkhu, Kathmandu",
			"Kupondole, Lalitpur",
			"Patan Dhoka, Lalitpur",
			"Boudha, Kathmandu",
			"Pulchowk, Lalitpur",
			"Koteshwor, Kathmandu",
			"Maharajgunj, Kathmandu",
			"Sanepa, Lalitpur",
			"Kumaripati, Lalitpur",
			"Baghbazar, Kathmandu",
			"New Road, Kathmandu",
			"Putalisadak, Kathmandu",
			"Lazimpat, Kathmandu",
			"Bishalnagar, Kathmandu",
		];

		const departments = [
			"Computer Engineering",
			"Electrical Engineering",
			"Mechanical Engineering",
			"Civil Engineering",
			"Electronics Engineering",
			"Information Technology",
			"Software Engineering",
			"Architecture",
			"Chemical Engineering",
			"Biomedical Engineering",
		];

		const designations = [
			"Assistant Professor",
			"Associate Professor",
			"Professor",
			"Senior Lecturer",
			"Lecturer",
		];

		const specializations = [
			"Programming & Software Development",
			"Power Systems",
			"Robotics",
			"Structural Engineering",
			"VLSI Design",
			"Artificial Intelligence",
			"Power Electronics",
			"Thermal Engineering",
			"Geotechnical Engineering",
			"Communication Systems",
		];

		const users = [];

		// Generate 200 users
		for (let i = 0; i < 200; i++) {
			const name = nepaliNames[i % nepaliNames.length];
			const address = kathmanduAddresses[i % kathmanduAddresses.length];
			const department = departments[i % departments.length];
			const designation = designations[i % designations.length];
			const specialization = specializations[i % specializations.length];
			const experience = Math.floor(Math.random() * 15) + 1;
			const uniqueId = Math.random().toString(36).substr(2, 9);

			// Generate unique username and email
			const username = `${name.first.toLowerCase()}.${name.last.toLowerCase()}.${
				i + 1
			}`;
			const email = `${name.first.toLowerCase()}.${name.last.toLowerCase()}.${
				i + 1
			}@example.com`;

			// Generate a valid date of birth (between 1980 and 1995)
			const year = 1980 + Math.floor(Math.random() * 15);
			const month = Math.floor(Math.random() * 12) + 1;
			const day = Math.floor(Math.random() * 28) + 1;
			const dateOfBirth = `${year}-${month.toString().padStart(2, "0")}-${day
				.toString()
				.padStart(2, "0")}`;

			users.push({
				id: `${i + 1}-${uniqueId}`,
				username,
				password: hashedPassword,
				email,
				fullName: `${name.first} ${name.last}`,
				dateOfBirth,
				role: "invigilator",
				status: "pending",
				gender: name.gender,
				address,
				phoneNumber: `98${Math.floor(Math.random() * 9000000) + 1000000}`,
				department,
				designation,
				experience_years: experience,
				specialization,
				max_duties_per_day: 2,
				max_duties_per_week: 8,
				isActive: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		// Insert users in batches to avoid overwhelming the database
		const batchSize = 50;
		for (let i = 0; i < users.length; i += batchSize) {
			const batch = users.slice(i, i + batchSize);
			await queryInterface.bulkInsert("Users", batch, {});
		}
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
