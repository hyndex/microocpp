const {
  notifyTransactionCompletion,
} = require('../webhooks/notifyTransactionCompletion');

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'ChargingSession',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        // autoIncrement: true,
      },
      formattedTransactionId: {
        type: DataTypes.VIRTUAL,
        get() {
          // Ensure the ID is at least 9 characters long, padded with zeros if necessary
          const rawId = this.getDataValue('transactionId');
          return rawId.toString().padStart(9, '0');
        },
      },
      startTime: {
        type: DataTypes.DATE,
      },
      endTime: {
        type: DataTypes.DATE,
      },
      meterStart: {
        type: DataTypes.FLOAT,
      },
      meterStop: {
        type: DataTypes.FLOAT,
      },
      // reservationId: {
      //   type: DataTypes.STRING,
      // },
      limit: {
        type: DataTypes.FLOAT,
      },
      reason: {
        type: DataTypes.STRING,
        validate: {
          isValidRole(value) {
            const option = [
              'DeAuthorized',
              'EmergencyStop',
              'EVDisconnected',
              'HardReset',
              'Local',
              'Other',
              'PowerLoss',
              'Reboot',
              'Remote',
              'SoftReset',
              'UnlockCommand',
              'Server',
              'Timeout',
            ];
            if (!option.includes(value)) {
              throw new Error(
                'Only DeAuthorized, EmergencyStop, EVDisconnected, HardReset, Local, Other, PowerLoss, Reboot, Remote, SoftReset, UnlockCommand, values are allowed!',
              );
            }
          },
        },
      },
      limitType: {
        type: DataTypes.STRING,
        defaultValue: 'KWH',
        validate: {
          isValidRole(value) {
            const option = ['KWH', 'TIME', 'SOC', 'FULL'];
            if (!option.includes(value)) {
              throw new Error(
                'Only KWH, AMOUNT, TIME, SOC, FULL values are allowed!',
              );
            }
          },
        },
      },
      idTagId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterUpdate: async (session, options) => {
          if (
            typeof session.meterStop === 'number' &&
            session.previous('meterStop') === null
          ) {
            await notifyTransactionCompletion(session);
          }
        },
      },
    },
  );
