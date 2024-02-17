const { Op } = require('sequelize');
const _ = require('lodash');
const getModels = require('../../models');

module.exports.checkForMeterValueTimeout = async () => {
  const db = getModels;

  const timeout = parseInt(process.env.METER_VALUE_TIMEOUT, 10) || 300; // Default to 5 minutes

  const sessions = await db.ChargingSession.findAll({
    where: {
      meterStop: null, // Only consider active sessions
      endTime: null,
      createdAt: {
        [Op.lte]: new Date(new Date() - timeout * 1000),
      },
    },
  });

  await Promise.all(
    sessions.map(async session => {
      let meterValue = await db.MeterValue.findAll({
        where: {
          ChargingSessionId: session.id,
          [Op.or]: [{ unit: 'kWh' }, { unit: 'Wh' }],
        },
      });
      meterValue = _.get(meterValue, '[0]', null);
      if (meterValue === null) {
        meterValue = {
          dataValues: {
            measurand: 'Energy.Active.Export.Interval',
            unit: 'Wh',
            value: 0,
          },
        };
      }
      try {
        if (
          _.toLower(meterValue.dataValues.measurand) ===
            'energy.active.export.register' ||
          _.toLower(meterValue.dataValues.measurand) ===
            'energy.active.import.register'
        ) {
          meterValue.dataValues.measurand = 'Energy.Active.Export.Interval';
          meterValue.dataValues.value -= session.dataValues.meterStart / 1000;
        }
      } catch (error) {
        //
      }

      meterValue.dataValues.value = _.toNumber(meterValue.dataValues.value);
      try {
        if (_.toLower(meterValue.dataValues.unit) === 'wh') {
          meterValue.dataValues.unit = 'kWh';
          meterValue.dataValues.value /= 1000;
        }
      } catch (error) {
        //
      }

      const meterEnd =
        session.dataValues.meterStart + meterValue.dataValues.value * 1000; // Convert kWh to Wh
      await session.update({
        meterStop: meterEnd,
        endTime: new Date(),
        reason: 'Timeout',
      });
    }),
  );
};
