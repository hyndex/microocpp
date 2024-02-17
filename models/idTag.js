/* eslint-disable no-param-reassign */
const { nanoid } = require('nanoid');
const { isBefore, isDate } = require('date-fns');

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'idTag',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => `${nanoid(15)}`,
        primaryKey: true,
      },
      parentIdtag: {
        type: DataTypes.STRING,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
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
          return this.id;
        },
        set(value) {
          this.id = value;
        },
      },
    },
    {},
  );
