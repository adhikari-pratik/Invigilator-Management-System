module.exports = (sequelize, DataTypes) => {
    const Assignment = sequelize.define('Assignment', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invigilatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      examId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Exams',
          key: 'id',
        },
      },
      classroomId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Classrooms',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
        defaultValue: 'pending',
      },
      assignedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      responseTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      responseNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      timestamps: true,
    });
  
    Assignment.associate = (models) => {
      Assignment.belongsTo(models.User, {
        foreignKey: 'invigilatorId',
        as: 'invigilator'
      });
      Assignment.belongsTo(models.Exam, {
        foreignKey: 'examId',
        as: 'exam'
      });
      Assignment.belongsTo(models.Classroom, {
        foreignKey: 'classroomId',
        as: 'classroom'
      });
      Assignment.belongsTo(models.User, {
        foreignKey: 'assignedBy',
        as: 'assigner'
      });
    };
  
    return Assignment;
  };