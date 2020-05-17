const config = require('config');
const fs = require('fs').promises;

const { expect } = require('chai');

const { convert } = require('./');

const AWS = require('../utils/aws');
const s3 = new AWS.S3();

describe('convert', () => {
  beforeEach(async () => {
    await s3.deleteObject({
      Bucket: config.awsBucket,
      Key: 'test/test-key',
    }).promise();
    await s3.putObject({
      Bucket: config.awsBucket,
      Key: 'test-key',
      Body: await fs.readFile('./test/examples/simplescale.wav'),
    }).promise();
  });

  it('should process an s3 event', async () => {
    // https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
    const event = {
      Records: [
        {
          s3: {
            bucket: {
              name: "test-bucket.localhost",
            },
            object: {
              key: "test-key",
            }
          }
        }
      ]
    };

    await convert(event);

    const rsp = await s3.headObject({
      Bucket: config.awsBucket,
      Key: 'test/test-key/out.mkv',
    }).promise();

    expect(rsp.ContentLength).to.be.above(0);
    expect(rsp.ETag).to.be.a('string');
    expect(rsp.ContentType).to.eql('video/mkv');
  });
});
