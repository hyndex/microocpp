/* eslint-disable no-param-reassign */
const { isBefore, isDate } = require('date-fns');

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'IdTag',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      tag_value: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_blocked',
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'expiry_date',
      },
      isExpired: {
        type: DataTypes.VIRTUAL,
        get() {
          return isDate(this.expiryDate)
            ? isBefore(this.expiryDate, new Date())
            : false;
        },
        set() {
          throw new Error('Cannot set exipry date');
        },
      },
      idTag: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.tag_value;
        },
        set(value) {
          this.tag_value = value;
        },
      },
    },
    { timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' },
  );
