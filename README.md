# config-obfuscator
Obfuscate application configuration

Provides a simple mechanism to obfuscate sensitive environment configuration. It allows you to retain config files within your application whilst making it harder for the 
casual observer to know your settings.

You can specify common configuration that applies to all environments and specific configuration for particular environments. 
Specific configuration overrides common configuration.

## Installation

    npm install --save config-obfuscator

## Example usage
To merge obfuscated configuration with the rest: 

    const _ = require('lodash');

    const obfuscator = require('config-obfuscator')({
      filename: __dirname + '/ob.cfg', 
      key: process.env.MY_CONFIG_KEY
    });

    const env = process.env.NODE_ENV || 'development';

    const myConfig = {
      some: {
        config: 'options'
      }
    };

    module.exports = _.merge(myConfig, obfuscator.get(env));
    
## Managing obfuscated configuration

    npm install -g config-obfuscator

* Add config that is common to all environments:

        config-obfuscator --add some-config.json --cfg ob.cfg --key "my config key"

* Add config that is specific to the test environment:

        config-obfuscator --add some-config.json --cfg ob.cfg --key "my config key" --env test

* View the configuration that is common to all environments:

        config-obfuscator --get ob.cfg --key "my config key"

* View the configuration that is specific to the test environment:

        config-obfuscator --get ob.cfg --key "my config key" --env test

* Remove a config item (itemName) from all environments:

        config-obfuscator --get ob.cfg --key "my config key" --remove itemName

* Remove a config item (itemName) from the text environment:

        config-obfuscator --get ob.cfg --key "my config key" --remove itemName --env test
