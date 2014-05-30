var assert = require('assert');
var localhost = require('./localhost');
var RequestJob = require('../lib/request-job');

describe('RequestJob', function() {

  it('should parse the uri', function() {
    var job = new RequestJob(1, {
      uri: 'https://localhost/api/v1/products'
    });
    assert.equal('localhost', job.host);
    assert.equal('/api/v1/products', job.path);
  });

  it('should populate the result with request timing and status', function(done) {
    var job = new RequestJob(1, {
      uri: 'https://localhost/api/v1/products'
    });
    job.on('end', function(result) {
      assert.equal(200, result.status);
      assert.equal(1, result.id);
      done();
    });
    job.run();
  });

});