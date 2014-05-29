#!/usr/bin/env node
var nomnom = require('nomnom');
var apiBench = require('../index');

function parseHeaders(rawHeaders) {
  var result = {};
  if(rawHeaders) {
    for(var i = 0, len = rawHeaders.length; i < len; i++) {
      var index = rawHeaders[i].indexOf(':');
      if(index === -1) {
        continue;
      }
      var key = rawHeaders[i].substring(0, index);
      var value = rawHeaders[i].substring(index + 1).trim();
      result[key] = value;
    }
  }
  return result;
}

var optsConfig = {
  uri: {
    position: 0,
    help: 'URI to run benchmark against',
    list: false,
    required: true
  },
  requests: {
    abbr: 'r',
    help: 'Number of requests',
    default: 100
  },
  concurrent: {
    abbr: 'c',
    help: 'Concurrent requests',
    default: 1
  },
  verbose: {
    abbr: 'v',
    flag: true,
    help: 'Output each request time',
    default: false
  },
  method: {
    abbr: 'm',
    help: 'HTTP method',
    default: 'GET'
  },
  header: {
    abbr: 'H',
    help: 'Specify HTTP headers to use on the requests, can be specified multiple times',
    list: true
  },
  script: {
    abbr: 's',
    help: 'Execution script that the benchmark will follow'
  },
  output: {
    abbr: 'o',
    help: 'Destination file for output, uses stdout if not specified'
  }
};

var opts = nomnom.script("api-bench").options(optsConfig).parse();
opts.header = parseHeaders(opts.header);

apiBench.start(opts);