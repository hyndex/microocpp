const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_CONNECTION_URL, {
  dialect: 'mysql',
  logging: false, // Consider turning logging off for production
});

// Import model definition functions
const defineIdTag = require('./idTag');
const defineCharger = require('./charger');
const defineConnector = require('./connector');
const defineChargingSession = require('./chargingSession');
const defineMeterValue = require('./meterValue');
const defineChargerConfig = require('./chargerConfig');

// Initialize models
const IdTag = defineIdTag(sequelize, Sequelize.DataTypes);
const Charger = defineCharger(sequelize, Sequelize.DataTypes);
const Connector = defineConnector(sequelize, Sequelize.DataTypes);
const ChargingSession = defineChargingSession(sequelize, Sequelize.DataTypes);
const MeterValue = defineMeterValue(sequelize, Sequelize.DataTypes);
const ChargerConfig = defineChargerConfig(sequelize, Sequelize.DataTypes);

// Define relationships
Charger.hasMany(Connector, { foreignKey: 'charger_id' });
Connector.belongsTo(Charger, { foreignKey: 'charger_id' });

ChargingSession.belongsTo(IdTag, { foreignKey: 'userId' });
IdTag.hasMany(ChargingSession, { foreignKey: 'userId' });

ChargingSession.belongsTo(Connector, { foreignKey: 'connectorId' });
Connector.hasMany(ChargingSession, { foreignKey: 'connectorId' });

ChargingSession.hasMany(MeterValue, { foreignKey: 'ChargingSessionId' });
MeterValue.belongsTo(ChargingSession, { foreignKey: 'ChargingSessionId' });

Charger.hasOne(ChargerConfig, { foreignKey: 'chargerId' });
ChargerConfig.belongsTo(Charger, { foreignKey: 'chargerId' });

module.exports = {
  sequelize,
  Sequelize,
  IdTag,
  Charger,
  Connector,
  ChargingSession,
  MeterValue,
  ChargerConfig,
};
