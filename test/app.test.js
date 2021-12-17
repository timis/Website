const app = require('../app');

const request = require('supertest');

describe('gae_node_request_example', () => {
  describe('GET /', () => {
    it('should get 200', (done) => {
      request(app).get('/').expect(200, done);
    });

    it('should get Hello, world - now with continuous deployment!', (done) => {
      request(app).get('/').expect('Hello, Scott!', done);
    });
  });
});
