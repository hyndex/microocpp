module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'MeterValues',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
      },
      format: {
        type: DataTypes.STRING,
      },
      context: {
        type: DataTypes.STRING,
      },
      measurand: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      timestamp: {
        type: DataTypes.DATE,
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      timestamps: false,
    },
  );
