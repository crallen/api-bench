var https = require('https');
var url = require('url');
var util = require('util');
var Job = require('./job');

function RequestJob(id, opts) {
  Job.apply(this, [id]);

  var parsed = url.parse(opts.uri);

  this.method = opts.method || 'GET';
  this.host = parsed.host;
  this.path = parsed.path;
  this.headers = opts.header;
}
util.inherits(RequestJob, Job);

RequestJob.prototype.run = function() {
  var options = {
    host: this.host,
    port: 443,
    path: this.path,
    method: this.method,
    headers: this.headers,
    rejectUnauthorized: false
  };

  var self = this;
  var start = new Date();

  var req = https.request(options, function(res) {
    var end = new Date();
    res.on('data', function() {});
    self.emit('end', { 
      duration: end - start,
      id: self.id,
      status: res.statusCode
    });
  });
  req.on('error', function() {});
  req.end();
};

module.exports = RequestJob;