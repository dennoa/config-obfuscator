'use strict';

const fs = require('fs');
const expect = require('chai').expect;

const obfuscator = require('../lib');

describe('config-obfuscator', ()=> {

  const filename = __dirname + '/ob-test.cfg';

  afterEach(done => {
    fs.unlink(filename, () => done() );
  });

  it('should add config that is common to all environments', ()=> {
    const ob = obfuscator({ filename: filename });
    const config = { my: { common: 'config' }}; 
    ob.add(config);
    expect(ob.get()).to.deep.equal(config);
  });

  it('should add config that is specific to a single enviromment', () => {
    const ob = obfuscator({ filename: filename });
    const config = { my: { 'environment-specific': 'config' }};
    ob.add(config, 'test');
    expect(ob.get('test')).to.deep.equal(config);
  });

  it('should allow specification of a configuration key', () => {
    const ob = obfuscator({ filename: filename, key: 'my-secret-key' });
    const config = { my: { common: 'config' }}; 
    ob.add(config);
    expect(ob.get()).to.deep.equal(config);
  });

  it('should override common config with environment-specific config',  () => {
    const ob = obfuscator({ filename: filename, key: 'my-secret-key' });
    const common = { my: { common: 'config' }}; 
    const specific = { my: { 'environment-specific': 'config', common: 'overridden' }};
    ob.add(common);
    ob.add(specific, 'test');
    expect(ob.get()).to.deep.equal(common);
    expect(ob.get('test')).to.deep.equal(specific);
  });

  it('should remove config for a specific environment', () => {
    const ob = obfuscator({ filename: filename });
    const config = { my: { envConfig: 'my config' }, your: { env: { config: 'your config' }}};
    ob.add(config, 'test');
    ob.remove('my', 'test');
    const updated = ob.get('test');
    expect(updated.my).not.to.be.defined;
    expect(updated.your).to.deep.equal(config.your);
  });

  it('should remove config for all environments', () => {
    const ob = obfuscator({ filename: filename });
    const common = { my: { common: 'config' }, your: 'config' }; 
    const specific = { my: { 'environment-specific': 'config', common: 'overridden' }, your: 'test config' };
    ob.add(common);
    ob.add(specific, 'test');
    ob.remove('my');
    const updatedCommon = ob.get();
    const updatedSpecific = ob.get('test');
    expect(updatedCommon.my).not.to.be.defined;
    expect(updatedSpecific.my).not.to.be.defined;
    expect(updatedCommon.your).to.equal(common.your);
    expect(updatedSpecific.your).to.equal(specific.your);
  });

});