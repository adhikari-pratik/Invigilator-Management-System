module.exports = (sequelize, DataTypes) => {
    const Exam = sequelize.define('Exam', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Duration in minutes',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    }, {
      timestamps: true,
    });
  
    Exam.associate = (models) => {
      Exam.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator'
      });
      Exam.belongsToMany(models.Classroom, {
        through: models.ExamClassroom,
        foreignKey: 'examId',
        as: 'classrooms'
      });
      Exam.hasMany(models.Assignment, {
        foreignKey: 'examId',
        as: 'assignments'
      });
    };
  
    return Exam;
  };