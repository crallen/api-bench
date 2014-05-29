var https = require('https');
var url = require('url');
var util = require('util');
var Job = require('./job').Job;

function RequestJob(id, opts) {
  Job.apply(this, [id]);

  var parsed = url.parse(opts.uri);

  this.method = opts.method || 'GET';
  this.host = parsed.host;
  this.path = parsed.path;
  this.headers = opts.header;
}
util.inherits(RequestJob, Job);

RequestJob.prototype.run = function(callback) {
  var options = {
    host: this.host,
    port: 443,
    path: this.path,
    method: this.method,
    headers: this.headers,
    rejectUnauthorized: false
  };
  var start = new Date();
  var id = this.id;
  var req = https.request(options, function(res) {
    var end = new Date();
    res.on('data', function() {});
    callback && callback({ 
      duration: end - start,
      id: id,
      status: res.statusCode
    });
  });
  req.on('error', function() {});
  req.end();
};

module.exports.RequestJob = RequestJob;