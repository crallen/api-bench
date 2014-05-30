var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Job(id) {
  EventEmitter.call(this);
  this.id = id;
}
util.inherits(Job, EventEmitter);

Job.prototype.run = function() {
  this.emit('end', { id: this.id });
};

module.exports = Job;