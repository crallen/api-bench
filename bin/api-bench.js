#!/usr/bin/env node
var nomnom = require('nomnom');
var apiBench = require('../index');

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
  script: {
    abbr: 's',
    help: 'Execution script that the benchmark will follow'
  },
  output: {
    abbr: 'o',
    help: 'Destination file for output, uses stdout if not specified'
  }
};

var opts = nomnom.options(optsConfig).parse();

apiBench.start(opts);