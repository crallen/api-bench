var assert = require('assert');
var util = require('util');
var Queue = require('../lib/queue');
var Job = require('../lib/job');

function TestJob(id) {
  Job.apply(this, [id]);
}
util.inherits(TestJob, Job);

TestJob.prototype.run = function(callback) {
  var id = this.id;
  setTimeout(function() {
    callback && callback({ id: id });
  }, 5);
};

describe('Queue', function() {
  describe('#add', function() {

    it('starts running as soon as a job is added', function(done) {
      var queue = new Queue(1);
      queue.on('jobDone', function(result) {
        assert.equal(1, result.id);
        done();
      });
      var job = new TestJob(1);
      queue.add(job);
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
        var job = new TestJob(i);
        queue.add(job);
      }
    });

  });
});