const config = require('config');
const sinon = require('sinon');
const { expect } = require('chai');
const superagent = require('superagent');
const supertest = require('supertest');

const fs = require('fs').promises;

const Router = require('./router');

const AWS = require('../utils/aws');

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

  describe('upload', () => {

    describe('presigned POST', () => {
      /**
       * TODO - This works with live s3 but not localstack
       **/

      describe('should create a signed POST upload url', () => {
        let rsp;
        let body;
        let firstCall;
        let jsonPolicy;

        beforeEach(async () => {
          rsp = await request.post('/upload/signed-url')
            .expect(200);

          body = rsp.body;

          expect(mockS3.createPresignedPost.calledOnce);
          ({ firstCall } = mockS3.createPresignedPost);


          jsonPolicy = JSON.parse(Buffer.from(body.fields.Policy, 'base64').toString());
        });

        it('url', () => {
          expect(body.url).to.contain(config.awsBucket);
        });

        it('bucket', () => {
          expect(body.fields.bucket).to.eql(config.awsBucket);
          expect(firstCall.args[0].Bucket).to.eql(config.awsBucket);
        });

        it('expires', () => {
          expect(body.fields.bucket).to.eql(config.awsBucket);
          expect(firstCall.args[0].Expires).to.eql(300);
        });

        it('starts-with key', () => {
          expect(firstCall.args[0].Conditions[0]).to.eql(
            ['starts-with', '$key', 'uploads/raw/']
          );
        });

        it('content length', () => {
          expect(firstCall.args[0].Conditions[1]).to.eql(
            ['content-length-range', 0, 52428800]
          );

          const contentLengthRange = jsonPolicy.conditions.find((i) => {
            return i[0] === 'content-length-range';
          });

          expect(contentLengthRange).to.eql(
            ['content-length-range', 0, 52428800]
          );
        });
      });

      it.skip('should be able to upload via post', async () => {
        const { body } = await request.post('/upload/signed-url')
          .expect(200);

        const data = body;

        const req = superagent.post(data.url);

        req.type('form');

        Object.keys(data.fields).map((key) => {
          req.field(key, data.fields[key]);
        });

        req.field("key", "uploads/raw/test");

        const buffer = Buffer.from("test23");

        req.attach("file", buffer)

        console.log(req);

        try {
          const rsp = await req;
          expect(rsp.statusCode).to.eql(204);
        } catch(e) {
          console.log(e);
          throw e;
        }

        const headRsp = await mockS3.headObject({
          Bucket: "shared-private-bucket.alexjpaz.com",
          Key: 'uploads/raw/test', // FIXME
        }).promise();

        expect(headRsp.ContentLength).not.to.eql(0);
        expect(headRsp.ContentLength).to.eql(buffer.length);
      });
    });

  describe('presigned PUT', () => {
    it('file', async () => {
      const { text }  = await request.put('/upload/signed-url')
        .expect(200);

      const url = text;

      const buffer = Buffer.from("test");

      const req = await superagent.put(url)
        .send(buffer);

      const headRsp = await mockS3.headObject({
        Bucket: config.awsBucket,
        Key: 'foobar', // FIXME
      }).promise();

      expect(headRsp.ContentLength).not.to.eql(0);
      expect(headRsp.ContentLength).to.eql(buffer.length);
    });
  });
});
});
