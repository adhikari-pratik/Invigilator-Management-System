require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "root",
		database: process.env.DB_NAME || "invigilator_system_dev",
		host: process.env.DB_HOST || "127.0.0.1",
		dialect: "mysql",
		logging: console.log,
	},
	test: {
		username: process.env.DB_USER || "root",
		password: process.env.DB_PASSWORD || "root",
		database: process.env.DB_NAME || "invigilator_system_test",
		host: process.env.DB_HOST || "127.0.0.1",
		dialect: "mysql",
		logging: false,
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "mysql",
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	},
};
