module.exports = (sequelize, DataTypes) => {
	const AuditLog = sequelize.define(
		"AuditLog",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
			},
			action: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			resourceType: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			resourceId: {
				type: DataTypes.UUID,
				allowNull: true,
			},
			details: {
				type: DataTypes.JSON,
				allowNull: true,
			},
			ipAddress: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: true,
		}
	);

	AuditLog.associate = (models) => {
		AuditLog.belongsTo(models.User, {
			foreignKey: "userId",
			as: "user",
		});
	};

	return AuditLog;
};
