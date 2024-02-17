/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const _ = require('lodash');

const ajv = new Ajv({ schemaId: 'auto' });
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

const myName = path.basename(__filename);
const RESPONSE = 'Response';
const REQ_VALIDATORS = {};
const CONF_VALIDATORS = {};

fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(file => file.isDirectory() && file.name !== myName)
  .forEach(dir => {
    const ocppVersion = dir.name;
    REQ_VALIDATORS[ocppVersion] = {};
    CONF_VALIDATORS[ocppVersion] = {};

    const schemaFiles = fs.readdirSync(path.join(__dirname, dir.name));
    schemaFiles.forEach(file => {
      if (file.endsWith('.json')) {
        const schemaValidator = ajv.compile(
          // eslint-disable-next-line import/no-dynamic-require
          require(path.join(__dirname, dir.name, file)),
        );
        const schemaName = file.replace(/\.json$/, '');
        const isResponse = schemaName.endsWith(RESPONSE);
        const key = isResponse
          ? schemaName.slice(0, -RESPONSE.length)
          : schemaName;
        const validators = isResponse
          ? CONF_VALIDATORS[ocppVersion]
          : REQ_VALIDATORS[ocppVersion];
        validators[key] = schemaValidator;
      }
    });
  });

module.exports = function validateOcppPayload(
  version = 'ocpp1.6j',
  action = 'Heartbeat',
  payload = {},
  isResponse = false,
) {
  const validator = _.get(
    isResponse ? CONF_VALIDATORS : REQ_VALIDATORS,
    `[${version}][${action}]`,
    () => true,
  );
  return validator(payload);
};
