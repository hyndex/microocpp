const { Op } = require('sequelize');
const _ = require('lodash');
const getModels = require('../../models');

module.exports.meterValueCheckStopTransaction = async ({
  chargingSessionId,
}) => {
  try {
    const db = getModels;
    const MeterValue = await db.MeterValue.findAll({
      where: {
        ChargingSessionId: chargingSessionId,
        [Op.or]: [{ unit: 'Wh' }, { unit: 'kWh' }],
      },
      include: [
        {
          model: db.ChargingSession,
          include: [{ model: db.SessionBilling }],
        },
      ],
    });

    let stop = false;
    const chargingSession = MeterValue[0].dataValues.ChargingSession.dataValues;

    // checking for kwh stop
    _.each(MeterValue, row => {
      let valueInWh = _.toNumber(row.dataValues.value);

      // Convert kWh to Wh if necessary
      if (_.toLower(row.dataValues.unit) === 'kwh') {
        valueInWh *= 1000;
      }

      // Check for stopping condition based on kWh
      if (
        (_.toLower(row.dataValues.measurand) ===
          'energy.active.export.register' ||
          _.toLower(row.dataValues.measurand) ===
            'energy.active.import.register' ||
          _.toLower(row.dataValues.measurand) ===
            'energy.active.export.interval' ||
          _.toLower(row.dataValues.measurand) ===
            'energy.active.import.interval') &&
        _.toUpper(chargingSession.limitType) === 'KWH' &&
        valueInWh - chargingSession.meterStart >= chargingSession.limit * 1000
      ) {
        stop = true;
      }
    });

    return stop;
  } catch (error) {
    console.log(error);
    return false;
  }
};
