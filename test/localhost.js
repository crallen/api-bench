var nock = require('nock');

var localhost = nock('https://localhost')
  .persist()
  .get('/api/v1/products')
  .reply(200);

module.exports = localhost;