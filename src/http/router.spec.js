const express = require('express');
const config = require('config');
const sinon = require('sinon');
const { expect } = require('chai');
const superagent = require('superagent');
const supertest = require('supertest');

const fs = require('fs').promises;

const Router = require('./router');

const AWS = require('../utils/aws');

const generateId = require('../utils/generateId');

describe('http/router', () => {
  let request;

  let mockS3;

  beforeEach(() => {
    mockS3 = new AWS.S3();

    sinon.spy(mockS3, 'getSignedUrlPromise');
    sinon.spy(mockS3, 'createPresignedPost');

    const app = express();

    // FAKE an aws request
    app.use((req, res, next) => {
      req.requestContext = {
        stage: "/fake"
      };

      next();
    });

    app.use(Router({
      s3: mockS3
    }));

    request = supertest(app);

    sinon.spy(fs, 'unlink');
    sinon.spy(fs, 'readFile');
  });

  afterEach(() => {
    fs.unlink.restore();
    fs.readFile.restore();
  });

  describe('public', () => {
    it('index', async () => {
      await request.get('/index.html')
        .expect(200, /<html>/);
      ;
    });

    it('root', async () => {
      await request.get('/index.html')
        .expect(200, /<html>/);
      ;
    });

    it('main.js', async () => {
      await request.get('/main.js')
        .expect(200, /WEBPACK/);
      ;
    });

    describe('html5fallback', () => {
      let testUrls = [
        '/some-html5-route',
        '/index.html',
        '/',
      ];

      for(let testUrl of testUrls) {
        it(testUrl, async () => {
          await request.get(testUrl)
            .expect(200)
            .expect(/<html>/)
            .expect(/window.Prestissimo = {/)
            .expect(/\"RouterBasename\": \"\/fake\"/)
          ;

          expect(fs.readFile.calledWith("public/index.html")).to.eql(true);
        });
      }
    })
  });


  // SAMPLE REQUEST
  /*

{
  accountId: 'offlineContext_accountId',
  apiId: 'offlineContext_apiId',
  authorizer: {
    scope: 'test',
    claims: {
      scope: 'test',
      sub: 'foo',
      aud: 'http://fake.local',
      iss: 'http://fake.local',
      iat: 1590673164
    },
    principalId: 'foo'
  },
  domainName: 'offlineContext_domainName',
  domainPrefix: 'offlineContext_domainPrefix',
  extendedRequestId: 'ckaqtqczf0005w9q960tr9rp5',
  httpMethod: 'GET',
  identity: {
    accessKey: null,
    accountId: 'offlineContext_accountId',
    apiKey: 'offlineContext_apiKey',
    caller: 'offlineContext_caller',
    cognitoAuthenticationProvider: 'offlineContext_cognitoAuthenticationProvider',
    cognitoAuthenticationType: 'offlineContext_cognitoAuthenticationType',
    cognitoIdentityId: 'offlineContext_cognitoIdentityId',
    cognitoIdentityPoolId: 'offlineContext_cognitoIdentityPoolId',
    principalOrgId: null,
    sourceIp: '127.0.0.1',
    user: 'offlineContext_user',
    userAgent: 'node-superagent/3.8.3',
    userArn: 'offlineContext_userArn'
  },
  path: '/local/api/{proxy*}',
  protocol: 'HTTP/1.1',
  requestId: 'ckaqtqczf0006w9q909g7hmyq',
  requestTime: '28/May/2020:09:39:24 -0400',
  requestTimeEpoch: 1590673164601,
  resourceId: 'offlineContext_resourceId',
  resourcePath: '/api/status',
  stage: 'local'
}

*/
});
