#!/usr/bin/env node

const fs = require('fs');
const obfuscator = require('../lib');

function exitWithUsageInstructions() {
  console.log('Usage:\nconfig-obfuscator (--add | --get) path/to/file [--key someKey] [--env someEnv] [--cfg path/to/cfg/file] [--remove someConfigProperty]\n');
  console.log('Where either --add or --get must be specified along with a path to the relevant file.\n');
  console.log('\t--add path/to/file\n\t\tAdds JSON configuration from the specified file to an obfuscated file of the same name with a ".cfg" extension (unless --cfg is specified).\n');
  console.log('\t--get path/to/file\n\t\tGets the configuration from the specified obfuscated file.\n');
  console.log('\t--key someKey\n\t\tIf specified, "someKey" will be used to encode / decode the data being added or viewed.\n');
  console.log('\t--env someEnv\n\t\tIf specified, "someEnv" will be used to identify the configuration as environment-specific.\n');
  console.log('\t\t\tFor --add, the configuration will be added as specific to the configuration environment.\n');
  console.log('\t\t\tFor --get, the configuration for the specific environment will be output.\n');
  console.log('\t--cfg path/to/cfg/file\n\t\tIf specified, new obfuscated configuration will be added to this file.\n');
  console.log('\t--remove someConfigProperty\n\t\tCan only be used in conjuncation with --get. If specified, the configuration property identified by someConfigProperty will be removed.\n');
  process.exit(1);
}

function exitWithError(err) {
  console.log(JSON.stringify(err));
  process.exit(1);
}

function getValue(key) {
  let pos = process.argv.indexOf(key);
  return (pos > 1 && pos < (process.argv.length - 1)) ? process.argv[pos+1] : null;
}

if (process.argv.length < 3) {
  exitWithUsageInstructions();
}

const addFile = getValue('--add');
const cfgFile = getValue('--cfg');
const getFile = getValue('--get');
const obKey = getValue('--key');
const env = getValue('--env');
const removeProp = getValue('--remove');

function handleAdd() {
  const json = fs.readFileSync(addFile, 'utf8');
  const obFile = cfgFile || (addFile + '.cfg');
  const ob = obfuscator({ filename: obFile, key: obKey });
  console.log('adding json configuration from ' + addFile + ' to ' + obFile + ' with key ' + ob.key + ' for ' + (env || 'any') + ' environment');
  console.log(JSON.stringify(ob.add(JSON.parse(json), env)));
}

function handleRemove(ob) {
  console.log('removing ' + removeProp + ' from the configuration in ' + getFile + ' with key ' + ob.key + ' for ' + (env || 'any') + ' environment');
  console.log(JSON.stringify(ob.remove(removeProp, env)));
}

function handleGet() {
  const ob = obfuscator({ filename: getFile, key: obKey });
  if (removeProp) {
    handleRemove(ob);
  } else {
    console.log('showing configuration from ' + getFile + ' with key ' + ob.key + ' for ' + (env || 'any') + ' environment');
    console.log(JSON.stringify(ob.get(env)));
  }
}

if (addFile) {
  handleAdd();
} else if (getFile) {
  handleGet();
} else {
  exitWithUsageInstructions();
}
