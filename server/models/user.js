module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			fullName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			dateOfBirth: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				comment: "User's date of birth",
			},
			role: {
				type: DataTypes.ENUM("admin", "invigilator"),
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM("pending", "approved", "rejected"),
				defaultValue: "pending",
			},
			gender: {
				type: DataTypes.ENUM("male", "female", "other"),
				allowNull: false,
			},
			address: {
				type: DataTypes.TEXT,
				allowNull: false,
				comment: "User's address in Kathmandu Valley",
			},
			phoneNumber: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: "User's contact number",
			},
			department: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: "User's department",
			},
			profileImage: {
				type: DataTypes.STRING,
				allowNull: true,
				comment: "URL to user's profile image",
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
				comment: "Whether the user account is active",
			},
			designation: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: "Role/position of the invigilator",
			},
			experience_years: {
				type: DataTypes.INTEGER,
				allowNull: false,
				comment: "Years of invigilation experience",
			},
			specialization: {
				type: DataTypes.STRING,
				allowNull: false,
				comment: "Area of expertise",
			},
			max_duties_per_day: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 2,
				comment: "Maximum number of duties allowed per day",
			},
			max_duties_per_week: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 8,
				comment: "Maximum number of duties allowed per week",
			},
		},
		{
			timestamps: true,
		}
	);

	User.associate = (models) => {
		User.hasMany(models.Assignment, {
			foreignKey: "invigilatorId",
			as: "assignments",
		});
		User.hasMany(models.Exam, {
			foreignKey: "createdBy",
			as: "createdExams",
		});
		User.hasMany(models.AuditLog, {
			foreignKey: "userId",
			as: "logs",
		});
	};

	return User;
};
