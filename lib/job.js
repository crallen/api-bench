var https = require('https');
var url = require('url');
var config = require('../config');

function Job(id, uri, method) {
  var parsed = url.parse(uri);

  this.id = id;
  this.method = method || 'GET';
  this.host = parsed.host;
  this.path = parsed.path;

  this.run = function(callback) {
    var options = {
      host: this.host,
      port: 443,
      path: this.path,
      method: this.method,
      headers: config.requestHeaders,
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
}

module.exports = Job;