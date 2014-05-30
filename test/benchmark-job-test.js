var assert = require('assert');
var localhost = require('./localhost');
var BenchmarkJob = require('../lib/benchmark-job');

describe('BenchmarkJob', function() {

  var opts = {
    uri: 'https://localhost/api/v1/products',
    requests: 10,
    concurrent: 1
  };

  it('should raise the end event with the calculated results of the run', function(done) {
    var job = new BenchmarkJob(1, opts);
    job.on('end', function(results) {
      assert.equal(10, results.config.requests);
      assert.equal(10, results.distribution.low.count);
      done();
    });
    job.run();
  });

  it('should raise the data event per request', function(done) {
    var job = new BenchmarkJob(1, opts);
    var counter = 0;

    job.on('data', function(result) {
      counter++;
    });
    job.on('end', function(results) {
      assert.equal(results.config.requests, counter);
      done();
    });
    job.run();
  });

});