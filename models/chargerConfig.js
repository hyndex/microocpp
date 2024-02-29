module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Chargerconfig',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.STRING,
      },
      readonly: {
        type: DataTypes.BOOLEAN,
      },
    },
    { timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' },
  );
