var https = require('https');
var util = require('util');
var Stats = require('fast-stats').Stats;
var Job = require('./job').Job;
var RequestJob = require('./request-job').RequestJob;
var Queue = require('./queue').Queue;
var Logger = require('./logger').Logger;

function BenchmarkJob(id, opts) {
  Job.apply(this, [id]);

  this.opts = opts;
  this.requestQueue = new Queue(this.opts.concurrent);
  this.logger = new Logger();

  this.requestQueue.on('jobDone', this.onJobDone.bind(this));
  this.requestQueue.on('complete', this.onQueueComplete.bind(this));
}
util.inherits(BenchmarkJob, Job);

BenchmarkJob.prototype.run = function(callback) {
  https.globalAgent.maxSockets = this.opts.concurrent;
  this.startTime = new Date();

  for(var i = 1; i <= this.opts.requests; i++) {
    var job = new RequestJob(i, this.opts);
    this.requestQueue.add(job);
  }
};

BenchmarkJob.prototype.onJobDone = function(result) {
  if(!this.opts.verbose) return;
  this.logger.write(result);
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
  var longest = range[1];
  var shortest = range[0];
  var dist = s.distribution();

  this.logger.write("");
  this.logger.write("=== Configuration ===");
  this.logger.write("");
  this.logger.write("Concurrent requests: " + this.opts.concurrent);
  this.logger.write("Total requests: " + this.opts.requests);
  this.logger.write("Run time: " + runTime + "s");
  this.logger.write("");

  this.logger.write("=== Stats ===");
  this.logger.write("");
  this.logger.write("Average:");
  this.logger.write(s.amean() + "ms");
  this.logger.write("");
  this.logger.write("Longest:");
  this.logger.write(longest + "ms");
  this.logger.write("");
  this.logger.write("Shortest:");
  this.logger.write(shortest + "ms");
  this.logger.write("");
  this.logger.write("Median:");
  this.logger.write(s.median() + "ms");
  this.logger.write("");

  this.logger.write("=== Distribution ===");
  this.logger.write("");

  var percent = 0;

  if(dist[0]) {
    percent = (dist[0].count / this.opts.requests) * 100;
    this.logger.write("500ms or less: " + dist[0].count + " (" + percent + "%)");
  }
  if(dist[1]) {
    percent = (dist[1].count / this.opts.requests) * 100;
    this.logger.write("");
    this.logger.write("Between 500ms and 1000ms: " + dist[1].count + " (" + percent + "%)");
  }
  if(dist[2]) {
    percent = (dist[2].count / this.opts.requests) * 100;
    this.logger.write("");
    this.logger.write("1000ms or more: " + dist[2].count + " (" + percent + "%)");
  }
};

module.exports.BenchmarkJob = BenchmarkJob;