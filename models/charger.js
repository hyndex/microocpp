module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Charger',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      meterValueInterval: {
        type: DataTypes.INTEGER,
      },
      lastHeartbeat: {
        type: DataTypes.DATE,
      },
      vendor: {
        type: DataTypes.STRING,
      },
      model: {
        type: DataTypes.STRING,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
      },
      verified: {
        type: DataTypes.BOOLEAN,
      },
      online: {
        type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
        get() {
          const timeDifference =
            new Date().getTime() -
            new Date(this.getDataValue('lastHeartbeat')).getTime();
          if (
            timeDifference >
            Number(process.env.WEB_SOCKET_PING_INTERVAL) + 10000 // adding extra 10 seconds for safety
          ) {
            return false;
          }
          return true;
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'AC',
        validate: {
          isValidRole(value) {
            const option = ['AC', 'DC', 'BOTH'];
            if (!option.includes(value)) {
              throw new Error('Only AC, DC, BOTH values are allowed!');
            }
          },
        },
      },
    },
    {
      scopes: {
        private: {
          attributes: {},
        },
      },
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      hooks: {},
    },
  );
