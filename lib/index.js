'use strict';

const crypto = require('crypto');
const fs = require('fs');
const _ = require('lodash');

function specified(prop) {
  return (typeof prop !== 'undefined') && (prop !== null);
}

module.exports = options => {

  const filename = options.filename;
  const key = options.key || 'config-obfuscator-key';

  function read() {
    try {
      const decipher = crypto.createDecipher('aes192', key);
      const decoded = decipher.update(fs.readFileSync(filename, 'binary'), 'hex', 'utf8') + decipher.final('utf8');
      return JSON.parse(decoded);
    } catch(err) {
      return {
        common: {},
        specific: {}
      }
    }
  }

  function write(config) {
    const cipher = crypto.createCipher('aes192', key);
    const encoded = cipher.update(JSON.stringify(config), 'utf8', 'hex') + cipher.final('hex'); 
    fs.writeFileSync(filename, encoded, 'binary');
  }

  function get(env) {
    const config = read();
    return specified(env) ? _.merge(config.common, config.specific[env]) : config.common;
  }

  function add(configUpdates, env) {
    const config = read();
    if (specified(env)) {
      config.specific[env] = _.merge({}, config.specific[env], configUpdates);
    } else {
      _.merge(config.common, configUpdates);
    }
    write(config);
    return get(env);
  }

  function removeConfig(topLevelConfigKey, commonOrSpecificConfig) {
    delete commonOrSpecificConfig[topLevelConfigKey];
  }

  function remove(topLevelConfigKey, env) {
    const config = read();
    if (specified(env) && config.specific[env]) {
      removeConfig(topLevelConfigKey, config.specific[env]);
    } else {
      _.forEach(config.specific, (envConfig) => {
        removeConfig(topLevelConfigKey, envConfig);
      });
      removeConfig(topLevelConfigKey, config.common);
    }
    write(config);
    return get(env);
  }

  return {
    add,
    get,
    remove,
    key,
  };

};
