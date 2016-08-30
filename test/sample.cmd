rem Uncomment whatever is appropriate to create sample data and use it in the various obfuscation actions

rem echo { "my": { "sample": "config" }, "with": { "common": "stuff also" } } > sample-common.json
rem echo { "my": { "sample": "test config" } } > sample-test.json
rem echo { "my": { "sample": "prod config" }, "with": { "prod": "stuff"} } > sample-prod.json

rem Adding configuration that is common across all environments
rem config-obfuscator --add sample-common.json --cfg ob.cfg --key "my secret key"

rem Adding configuration that is specific to the test environment
rem config-obfuscator --add sample-test.json --cfg ob.cfg --key "my secret key" --env test

rem Adding configuration that is specific to the prod environment
rem config-obfuscator --add sample-prod.json --cfg ob.cfg --key "my secret key" --env prod

rem Getting configuration that is common across all environments
rem config-obfuscator --get ob.cfg --key "my secret key"

rem Getting configuration that is specific to the test environment
rem config-obfuscator --get ob.cfg --key "my secret key" --env test

rem Getting configuration that is specific to the prod environment
rem config-obfuscator --get ob.cfg --key "my secret key" --env prod

rem Removing the "my" configuration property from all environments
rem config-obfuscator --get ob.cfg --key "my secret key" --remove my

rem Removing the "with" configuration property from the prod environment
rem config-obfuscator --get ob.cfg --key "my secret key" --remove with --env prod
