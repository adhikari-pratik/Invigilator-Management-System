module.exports = (sequelize, DataTypes) => {
	const Classroom = sequelize.define(
		"Classroom",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			room_number: {
				type: DataTypes.STRING(50),
				allowNull: false,
				unique: true,
			},
			building: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: 1,
				},
			},
			floor: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: 0,
				},
			},
			has_projector: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			has_computer: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			has_whiteboard: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			status: {
				type: DataTypes.ENUM("active", "inactive"),
				defaultValue: "active",
			},
			block: {
				type: DataTypes.STRING(10),
				allowNull: false,
			},
			department_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			department_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: true,
		}
	);

	Classroom.associate = (models) => {
		Classroom.hasMany(models.ExamClassroom, {
			foreignKey: "classroomId",
			as: "examAssignments",
		});
	};

	return Classroom;
};
