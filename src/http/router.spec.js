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

    request = supertest(Router({
      s3: mockS3
    }));

    sinon.spy(fs, 'unlink');
  });

  afterEach(() => {
    fs.unlink.restore();
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
  });
});
