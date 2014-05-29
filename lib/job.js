function Job(id) {
  this.id = id;
}

Job.prototype.run = function(callback) {
  callback && callback();
};

module.exports.Job = Job;