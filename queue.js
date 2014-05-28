var EventEmitter = require('events').EventEmitter;

function Queue(maxRunning) {
  this.jobsWaiting = [];
  this.jobsRunning = {};
  this.results = {};
  this.jobCounter = 0;
  this.maxRunning = maxRunning;

  EventEmitter.call(this);

  function run() {
    if(this.jobCounter >= this.maxRunning) {
      return;
    }
    if(!this.jobsWaiting.length) {
      return;
    }

    var job = this.jobsWaiting.shift();
    var id = job.id;

    this.jobCounter++;
    this.jobsRunning[id] = job;

    var cb = (function(result) {
      onJobDone.apply(this, [id, result]);
    }).bind(this);

    job.run(cb);
  }

  function onJobDone(id, result) {
    this.emit('jobDone', result);
    this.results[id] = result;

    delete this.jobsRunning[id];
    this.jobCounter--;

    if(this.jobsWaiting.length) {
      this.emit('next');
    } else if(!this.jobCounter) {
      this.emit('complete', this.results);
    }
  }

  this.on('queued', run);
  this.on('next', run);

  this.add = function(job) {
    this.jobsWaiting.push(job);
    this.emit('queued');
  };
}

Queue.prototype.__proto__ = EventEmitter.prototype;

module.exports = Queue;