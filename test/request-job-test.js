var assert = require('assert');
var nock = require('nock');
var RequestJob = require('../lib/request-job');

var localhost = nock('https://localhost')
  .get('/api/v1/products')
  .reply(200);

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
    job.run(function(result) {
      assert(result.duration);
      assert.equal(200, result.status);
      assert.equal(1, result.id);
      done();
    });
  });

});