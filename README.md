api-bench
=========

Hacked together utility to get some basic metrics. Pretty specific to the purpose it was designed for. Work in progress.

Usage information available via `node index.js --help`.

```shell
$ node index.js --help

Usage: node index.js <endpoint> [options]

endpoint     Endpoint to hit on the configured host

Options:
   -r, --requests     Number of requests  [100]
   -c, --concurrent   Concurrent requests  [1]
   -v, --verbose      Output each request time  [false]
   -m, --method       HTTP method  [GET]
```

Copy config.js.template to config.js and adjust accordingly before attempting to use.

### TODO

* Set headers on the command line arguments
* Set host on command line arguments