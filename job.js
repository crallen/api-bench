var https = require('https');
var config = require('./config');

function Job(id, endpoint, method) {
  this.id = id;
  this.endpoint = endpoint;
  this.method = method || 'GET';

  this.run = function(callback) {
    var options = {
      host: config.host,
      port: 443,
      path: this.endpoint,
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