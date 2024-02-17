const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'MeterValues',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(20),
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
      timestamps: false,
    },
  );
