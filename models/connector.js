const { nanoid } = require('nanoid');
const {
  notifyConnectorStatusChange,
} = require('../webhooks/notifyConnectorStatusChange');

module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Connector',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => `connector_${nanoid(10)}`,
        primaryKey: true,
      },
      connectorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Unavailable',
        validate: {
          isValidRole(value) {
            const option = [
              'Available',
              'Preparing',
              'Charging',
              'SuspendedEVSE',
              'SuspendedEV',
              'Finishing',
              'Reserved',
              'Unavailable',
              'Faulted',
            ];
            if (!option.includes(value)) {
              throw new Error(
                'Only Available, Preparing, Charging, SuspendedEVSE, SuspendedEV, Finishing, Reserved, Unavailable, Faulted values are allowed!',
              );
            }
          },
        },
      },
    },
    {
      hooks: {
        // eslint-disable-next-line no-unused-vars
        afterUpdate: async (connector, options) => {
          if (['Faulted', 'Unavailable'].includes(connector.status)) {
            await notifyConnectorStatusChange(connector);
          }
        },
      },
    },
  );
