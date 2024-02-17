const db = require('./models');

module.exports.migrate = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
