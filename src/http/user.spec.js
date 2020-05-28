const { expect } = require('chai');
const express = require('express');
const supertest = require('supertest');

const { User } = require('./user');

describe('@wip User', () => {
  let request;

  beforeEach(() => {
    const app = express();

    app.use((req, res, next) => {
      req.authorizer = {
        scope: 'test',
        claims: {
          scope: 'test',
          sub: 'foo',
          aud: 'http://fake.local',
          iss: 'http://fake.local',
          iat: 1590673164
        },
        principalId: 'foo'
      };
      next();
    });

    app.use(User());

    app.get('/test', (req, res) => {
      res.send(req.authorizer);
    });

    request = supertest(app);
  });

  it('should log things', async () => {
    const { body } = await request.get('/test')
      .expect(200)
    ;

    expect(body.claims.sub).to.eql('foo');

  });
});

