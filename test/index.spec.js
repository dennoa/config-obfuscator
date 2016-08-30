'use strict';

const fs = require('fs');
const expect = require('chai').expect;

const obfuscator = require('../lib');

describe('config-obfuscator', ()=> {

  let filename = __dirname + '/ob-test.cfg';

  afterEach(done => {
    fs.unlink(filename, () => done() );
  });

  it('should add config that is common to all environments', ()=> {
    let ob = obfuscator({ filename: filename });
    let config = { my: { common: 'config' }}; 
    ob.add(config);
    expect(ob.get()).to.deep.equal(config);
  });

  it('should add config that is specific to a single enviromment', () => {
    let ob = obfuscator({ filename: filename });
    let config = { my: { 'environment-specific': 'config' }};
    ob.add(config, 'test');
    expect(ob.get('test')).to.deep.equal(config);
  });

  it('should allow specification of a configuration key', () => {
    let ob = obfuscator({ filename: filename, key: 'my-secret-key' });
    let config = { my: { common: 'config' }}; 
    ob.add(config);
    expect(ob.get()).to.deep.equal(config);
  });

  it('should override common config with environment-specific config',  () => {
    let ob = obfuscator({ filename: filename, key: 'my-secret-key' });
    let common = { my: { common: 'config' }}; 
    let specific = { my: { 'environment-specific': 'config', common: 'overridden' }};
    ob.add(common);
    ob.add(specific, 'test');
    expect(ob.get()).to.deep.equal(common);
    expect(ob.get('test')).to.deep.equal(specific);
  });

  it('should remove config for a specific environment', () => {
    let ob = obfuscator({ filename: filename });
    let config = { my: { envConfig: 'my config' }, your: { env: { config: 'your config' }}};
    ob.add(config, 'test');
    ob.remove('my', 'test');
    let updated = ob.get('test');
    expect(updated.my).not.to.be.defined;
    expect(updated.your).to.deep.equal(config.your);
  });

  it('should remove config for all environments', () => {
    let ob = obfuscator({ filename: filename });
    let common = { my: { common: 'config' }, your: 'config' }; 
    let specific = { my: { 'environment-specific': 'config', common: 'overridden' }, your: 'test config' };
    ob.add(common);
    ob.add(specific, 'test');
    ob.remove('my');
    let updatedCommon = ob.get();
    let updatedSpecific = ob.get('test');
    expect(updatedCommon.my).not.to.be.defined;
    expect(updatedSpecific.my).not.to.be.defined;
    expect(updatedCommon.your).to.equal(common.your);
    expect(updatedSpecific.your).to.equal(specific.your);
  });

});