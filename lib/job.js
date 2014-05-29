var https = require('https');
var url = require('url');

function Job(id, opts) {
  var parsed = url.parse(opts.uri);

  this.id = id;
  this.method = opts.method || 'GET';
  this.host = parsed.host;
  this.path = parsed.path;
  this.headers = opts.header;
}

Job.prototype.run = function(callback) {
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
    callback({ 
      duration: end - start,
      id: id,
      status: res.statusCode
    });
  });
  req.on('error', function() {});
  req.end();
};

module.exports = Job;