function Logger(destination) {
  this.write = console.log;
}

module.exports.Logger = Logger;