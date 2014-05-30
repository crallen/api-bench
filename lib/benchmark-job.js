var https = require('https');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Stats = require('fast-stats').Stats;
var Job = require('./job');
var RequestJob = require('./request-job');
var Queue = require('./queue');

function BenchmarkJob(id, opts) {
  EventEmitter.call(this);
  Job.apply(this, [id]);

  this.opts = opts;
  this.requestQueue = new Queue(this.opts.concurrent);

  this.requestQueue.on('jobDone', this.onJobDone.bind(this));
  this.requestQueue.on('complete', this.onQueueComplete.bind(this));
}
util.inherits(BenchmarkJob, Job);

BenchmarkJob.prototype.run = function() {
  https.globalAgent.maxSockets = this.opts.concurrent;

  this.startTime = new Date();

  for(var i = 1; i <= this.opts.requests; i++) {
    var job = new RequestJob(i, this.opts);
    this.requestQueue.add(job);
  }
  this.requestQueue.start();
};

BenchmarkJob.prototype.onJobDone = function(result) {
  this.emit('data', result);
};

BenchmarkJob.prototype.onQueueComplete = function(results) {
  var end = new Date();
  var diff = end - this.startTime;
  var runTime = diff / 1000;

  var s = new Stats({ buckets: [500, 1000] });
  for(var id in results) {
    s.push(results[id].duration);
  }

  var range = s.range();
  var dist = s.distribution();
  var shortRange = midRange = highRange = 0;

  for(var i = 0; i < dist.length; i++) {
    var distData = dist[i];

    if(distData.range[1] === 500) {
      shortRange = distData.count;
    } else if(distData.range[1] === 1000) {
      midRange = distData.count;
    } else {
      highRange = distData.count;
    }
  }

  var benchmarkResults = {
    config: {
      requests: this.opts.requests,
      concurrent: this.opts.concurrent
    },
    totalRunTime: runTime,
    averageRequestTime: s.amean(),
    minRequestTime: range[0],
    maxRequestTime: range[1],
    medianRequestTime: s.median(),
    distribution: {
      low: {
        description: "500ms or less",
        count: shortRange,
        percent: (shortRange / this.opts.requests) * 100
      },
      mid: {
        description: "Between 500ms and 1000ms",
        count: midRange,
        percent: (midRange / this.opts.requests) * 100
      },
      high: {
        description: "1000ms or more",
        count: highRange,
        percent: (highRange / this.opts.requests) * 100
      }
    }
  };

  this.emit('end', benchmarkResults);
};

module.exports = BenchmarkJob;