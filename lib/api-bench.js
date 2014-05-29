var BenchmarkJob = require('./benchmark-job');

module.exports = {

  start: function(opts) {
    new BenchmarkJob(1, opts).run();
  }

};