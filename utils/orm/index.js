// In ../utils/orm/index.js or similar file
const { Sequelize } = require('sequelize');

module.exports = () => {
  // Configuration logic to instantiate and return a Sequelize instance
  let DB_CONNECTION_URL;
  try {
    DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
  } catch (error) {
    console.error('Unable to parse DB_CONNECTION_URL', error);
    return null;
  }

  return new Sequelize(DB_CONNECTION_URL);
};
