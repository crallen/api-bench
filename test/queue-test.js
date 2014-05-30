var assert = require('assert');
var util = require('util');
var Queue = require('../lib/queue');
var Job = require('../lib/job');

describe('Queue', function() {
  
  it('raises job done event when each job is finished', function(done) {
    var queue = new Queue(1);
    queue.on('jobDone', function(result) {
      assert.equal(1, result.id);
      done();
    });
    queue.add(new Job(1));
    queue.start();
  });

  it('raises complete event when queue is finished', function(done) {
    var queue = new Queue(1);
    queue.on('complete', function(results) {
      for(var i in results) {
        assert.equal(i, results[i].id);
      }
      done();
    });
    for(var i = 1; i <= 10; i++) {
      var job = new Job(i);
      queue.add(job);
    }
    queue.start();
  });

});