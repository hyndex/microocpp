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
        },
      ],
    });

    let stop = false;

    // Check if MeterValue has any elements
    if (MeterValue.length > 0 && MeterValue[0].dataValues) {
      const chargingSession =
        MeterValue[0].dataValues.ChargingSession.dataValues;

      // Check for stopping condition based on kWh
      _.each(MeterValue, row => {
        let valueInWh = _.toNumber(row.dataValues.value);

        // Convert kWh to Wh if necessary
        if (_.toLower(row.dataValues.unit) === 'kwh') {
          valueInWh *= 1000;
        }

        if (
          _.toUpper(chargingSession.limitType) === 'KWH' &&
          (_.toLower(row.dataValues.measurand) ===
            'energy.active.export.register' ||
            _.toLower(row.dataValues.measurand) ===
              'energy.active.import.register' ||
            _.toLower(row.dataValues.measurand) ===
              'energy.active.export.interval' ||
            _.toLower(row.dataValues.measurand) ===
              'energy.active.import.interval') &&
          valueInWh - chargingSession.meterStart >= chargingSession.limit * 1000
        ) {
          stop = true;
        }
      });

      // Check for stopping condition based on time
      if (_.toUpper(chargingSession.limitType) === 'TIME') {
        const startTime = new Date(chargingSession.startTime);
        const currentTime = new Date();
        const elapsedTimeInMinutes = (currentTime - startTime) / (1000 * 60);

        if (elapsedTimeInMinutes >= chargingSession.limit) {
          stop = true;
        }
      }
    }

    return stop;
  } catch (error) {
    console.log(error);
    return false;
  }
};
