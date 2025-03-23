module.exports = (sequelize, DataTypes) => {
	const ExamClassroom = sequelize.define(
		"ExamClassroom",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			examId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "Exams",
					key: "id",
				},
			},
			classroomId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "Classrooms",
					key: "id",
				},
			},
			requiredInvigilators: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			notes: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			timestamps: true,
			underscored: true,
		}
	);

	ExamClassroom.associate = (models) => {
		ExamClassroom.belongsTo(models.Exam, {
			foreignKey: "examId",
			as: "exam",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
		ExamClassroom.belongsTo(models.Classroom, {
			foreignKey: "classroomId",
			as: "classroom",
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		});
	};

	return ExamClassroom;
};
