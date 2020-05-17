const { expect } = require('chai');

const { once } = require('events');
const express = require('express');

const { JWKS, JWT } = require('jose');

const very_much_not_secure  = require('../../test/very_much_not_secure/jwks.json');

const Authorizer = require('./authorizer');

describe('authorizer', () => {
  let app;
  let server;
  let authorizer;

  before(async () => {
    app = express();

    app.get('/.well-known/jwks.json', (req, res) => {
      res.send(very_much_not_secure);
    });

    server = app.listen();

    await once(server, 'listening');

    authorizer = Authorizer({
      audience: "fake",
      issuer: "fake",
      jwksUri: `http://localhost:${server.address().port}/.well-known/jwks.json`
    });
  });

  after(async () => {
    if(server) {
      server.close();
    }
  });

  describe('should reject', () => {
    const test = (name, event) => {
      it(name, async () => {
        let failed = false;
        try {
          const result = await authorizer(event);
        } catch(e) {
          // console.error(e.message);
          failed = true;
        }

        expect(failed).to.eql(true);
      });
    };

    test('null', null);
    test('empty object', {});
    test('bad type', { type: "FOO" });
    test('no token', { type: "TOKEN" });
    test('invalid token match', { type: "TOKEN", authorizationToken: "Foo 1" });
    test('invalid token match', { type: "TOKEN", authorizationToken: "Bearer zzz" });
  });

  describe('valid tokens', () => {
    let token;
    let result;

    before(async () => {
      let key = very_much_not_secure.keys[0]

      token = JWT.sign({
        sub: "123",
        foo: "bar",
        aud: "fake",
        iss: "fake",
        scope: "test"
      }, key);

      const event = {
        type: "TOKEN",
        authorizationToken: `Bearer ${token}`,
        methodArn :"arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/*/GET/"
      }

      result = await authorizer(event);
    });

    it('policyDocument', async () => {
      expect(result.policyDocument).to.be.ok;
    });

    it('principalId', async () => {
      expect(result.principalId).to.be.eql("123");
    });

    it('scope', async () => {
      expect(result.context.scope).to.eql("test");
    });

    it('scope', async () => {
      expect(result.policyDocument.Statement[0].Resource).to.include("ymy8tbxw7b");
    });
  });
});
