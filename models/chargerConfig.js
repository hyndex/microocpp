const { nanoid } = require('nanoid');

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Chargerconfig',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => `Chargerconfig_${nanoid(20)}`,
        primaryKey: true,
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
    {},
  );
