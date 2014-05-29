api-bench
=========

Hacked together utility to get some basic metrics. Pretty specific to the purpose it was designed for. Work in progress.

Usage information available via `bin\api-bench --help`.

```shell
$ bin\api-bench --help

Usage: api-bench <uri> [options]

uri     URI to run benchmark against

Options:
   -r, --requests     Number of requests  [100]
   -c, --concurrent   Concurrent requests  [1]
   -v, --verbose      Output each request time  [false]
   -m, --method       HTTP method  [GET]
   -H, --header       Specify HTTP headers to use on the requests, can be specified multiple times
   -s, --script       Execution script that the benchmark will follow
   -o, --output       Destination file for output, uses stdout if not specified
```

Copy config.js.template to config.js and adjust accordingly before attempting to use.

### TODO

* Support request bodies (via a file path perhaps)
* Implement output file
* Implement execution script