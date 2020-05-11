const config = require('config');
const sinon = require('sinon');
const { expect } = require('chai');
const supertest = require('supertest');

const fs = require('fs').promises;

const Router = require('./router');

const AWS = require('../utils/aws');

describe('http/router', () => {
  let request;

  let mockS3;

  beforeEach(() => {
    mockS3 = new AWS.S3();

    sinon.spy(mockS3, 'putObject');

    request = supertest(Router({
      s3: mockS3
    }));

    sinon.spy(fs, 'unlink');
  });

  afterEach(() => {
    fs.unlink.restore();
  });

  describe('upload', () => {
    it('m4a file', async () => {
      await request.post('/upload')
        .set('Content-Type', 'multipart/form-data')
        .type('form')
        .attach("file", "./test/Beachy.m4a")
        .expect(201);
      ;

      expect(fs.unlink.calledOnce).to.eql(true);

      expect(mockS3.putObject.calledOnce).to.eql(true);

      const params = mockS3.putObject.args[0][0];

      expect(params.Key).to.match(/Beachy\.m4a$/);
      expect(params.Body).to.be.a('Uint8Array');
      expect(params.Body.length).to.eql(538295);

      const headRsp = await mockS3.headObject({
        Bucket: params.Bucket,
        Key: params.Key,
      }).promise();

      expect(headRsp.ContentLength).to.eql(538295);
    });

    it('multiple files', async () => {
      await request.post('/upload')
        .set('Content-Type', 'multipart/form-data')
        .type('form')
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .expect(201);
      ;

      const calls = mockS3.putObject.getCalls();

      expect(calls.length).to.eql(10);
      expect(fs.unlink.getCalls().length).to.eql(10);

      for(let call of calls) {
        const params = call.args[0];

        expect(params.Key).to.match(/Beachy\.m4a$/);
        expect(params.Body).to.be.a('Uint8Array');
        expect(params.Body.length).to.eql(538295);

        const headRsp = await mockS3.headObject({
          Bucket: params.Bucket,
          Key: params.Key,
        }).promise();

        expect(headRsp.ContentLength).to.eql(538295);
      }
    });

    it('multiple files exceed maximum', async () => {
      await request.post('/upload')
        .set('Content-Type', 'multipart/form-data')
        .type('form')
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .attach("file", "./test/Beachy.m4a")
        .expect(500);
      ;
    });
  });
});
