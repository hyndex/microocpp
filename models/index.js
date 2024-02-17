const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_CONNECTION_URL, {
  dialect: 'postgres',
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
Charger.hasMany(Connector);
Connector.belongsTo(Charger);

ChargingSession.belongsTo(IdTag);
IdTag.hasMany(ChargingSession);

ChargingSession.belongsTo(Connector);
Connector.hasMany(ChargingSession);

ChargingSession.hasMany(MeterValue);
MeterValue.belongsTo(ChargingSession);

Charger.hasOne(ChargerConfig);
ChargerConfig.belongsTo(Charger);

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
