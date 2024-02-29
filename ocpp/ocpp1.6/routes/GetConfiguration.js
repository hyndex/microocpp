const connectedCps = require('../connectedCps');
const db = require('../../../models');

async function getConfiguration(req, res) {
  try {
    const { cpid, key } = req.body; // key is optional
    const device = connectedCps.get(cpid);

    if (!device) {
      return res
        .status(404)
        .send({ status: 'Error', message: 'Charger not connected.' });
    }

    try {
      const response = await device.sendCall('GetConfiguration', { key });
      const configurationKeys = response?.payload?.configurationKey || [];

      // Process each configuration and save/update in DB using Promise.all to handle in parallel
      await Promise.all(
        configurationKeys.map(config =>
          db.ChargerConfig.findOrCreate({
            where: {
              key: config.key,
            },
            include: [
              {
                model: db.Charger,
                where: {
                  uuid: cpid,
                },
              },
            ],
            defaults: {
              value: config.value,
              readonly: config.readonly,
            },
          }).then(([configInstance, created]) => {
            if (
              !created &&
              (configInstance.value !== config.value ||
                configInstance.readonly !== config.readonly)
            ) {
              return configInstance.update({
                value: config.value,
                readonly: config.readonly,
              });
            }
            return null; // Return null if no update is necessary
          }),
        ),
      );

      res.status(200).send({
        status: 'Accepted',
        message: 'Get configuration command processed.',
        configuration: response,
      });
    } catch (error) {
      console.error(`Error sending GetConfiguration to ${cpid}:`, error);
      res.status(500).send({
        status: 'Error',
        message: 'Error sending command to charger.',
      });
    }
  } catch (error) {
    // Catching synchronous errors or unexpected issues
    console.error(
      `Unexpected error in GetConfiguration for ${req.body.cpid}:`,
      error,
    );
    res.status(500).send({
      status: 'Error',
      message: 'An unexpected error occurred.',
      details: error.message, // Send a cleaner error message if possible
    });
  }
}

module.exports = getConfiguration;
