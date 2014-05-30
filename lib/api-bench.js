var BenchmarkJob = require('./benchmark-job');

module.exports = {

  start: function(opts) {
    this.job = new BenchmarkJob(1, opts);

    if(opts.verbose) {
      this.job.on('data', this.logRequest.bind(this));
    }
    this.job.on('end', this.logComplete.bind(this));

    this.job.run();
  },

  logRequest: function(result) {
    console.log(result);
  },

  logComplete: function(results) {
    console.log("");
    console.log("=== Configuration ===");
    console.log("");
    console.log("Concurrent requests: " + results.config.concurrent);
    console.log("Total requests: " + results.config.requests);
    console.log("Run time: " + results.totalRunTime + "s");
    console.log("");

    console.log("=== Stats ===");
    console.log("");
    console.log("Average:");
    console.log(results.averageRequestTime + "ms");
    console.log("");
    console.log("Longest:");
    console.log(results.maxRequestTime + "ms");
    console.log("");
    console.log("Shortest:");
    console.log(results.minRequestTime + "ms");
    console.log("");
    console.log("Median:");
    console.log(results.medianRequestTime + "ms");
    console.log("");

    console.log("=== Distribution ===");
    console.log("");

    for(var key in results.distribution) {
      var dist = results.distribution[key];
      console.log(dist.description + ": " + dist.count + " (" + dist.percent + "%)");
    }
  }

};