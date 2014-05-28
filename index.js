var https = require('https');
var nomnom = require('nomnom');
var Stats = require('fast-stats').Stats;
var Queue = require('./queue');
var Job = require('./job');

nomnom.options({
  endpoint: {
    position: 0,
    help: 'Endpoint to hit on the configured host',
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
  }
});

var opts = nomnom.parse();

https.globalAgent.maxSockets = opts.concurrent;

var queue = new Queue(opts.concurrent);

queue.on('jobDone', onJobDone);
queue.on('complete', onQueueComplete);

for(var i = 1; i <= opts.requests; i++) {
  var job = new Job(i, opts.endpoint, opts.method);
  queue.add(job);
}

function onJobDone(result) {
  if(opts.verbose) {
    console.log(result);
  }
}

function onQueueComplete(results) {
  var s = new Stats({ buckets: [500, 1000] });

  for(var id in results) {
    s.push(results[id].duration);
  }

  var range = s.range();
  var longest = range[1];
  var shortest = range[0];
  var dist = s.distribution();

  console.log("");
  console.log("=== Configuration ===");
  console.log("");
  console.log("Concurrent requests: " + opts.concurrent);
  console.log("Total requests: " + opts.requests);
  console.log("");

  console.log("=== Stats ===");
  console.log("");
  console.log("Average:");
  console.log(s.amean() + "ms");
  console.log("");
  console.log("Longest:");
  console.log(longest + "ms");
  console.log("");
  console.log("Shortest:");
  console.log(shortest + "ms");
  console.log("");
  console.log("Median:");
  console.log(s.median() + "ms");
  console.log("");

  console.log("=== Distribution ===");
  console.log("");

  var percent = 0;

  if(dist[0]) {
    percent = (dist[0].count / opts.requests) * 100;
    console.log("500ms or less: " + dist[0].count + " (" + percent + "%)");
  }
  if(dist[1]) {
    percent = (dist[1].count / opts.requests) * 100;
    console.log("");
    console.log("Between 500ms and 1000ms: " + dist[1].count + " (" + percent + "%)");
  }
  if(dist[2]) {
    percent = (dist[2].count / opts.requests) * 100;
    console.log("");
    console.log("1000ms or more: " + dist[2].count + " (" + percent + "%)");
  }
}