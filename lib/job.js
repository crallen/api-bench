function Job(id) {
  this.id = id;
}

Job.prototype.run = function(callback) {
  callback && callback({ id: this.id });
};

module.exports = Job;