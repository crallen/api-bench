var BenchmarkJob = require('./benchmark-job').BenchmarkJob;

module.exports.start = function(opts) {

  new BenchmarkJob(1, opts).run();

};