const config = require('config');
const fs = require('fs').promises;

const { expect } = require('chai');

const { convert } = require('./');

const AWS = require('../utils/aws');
const s3 = new AWS.S3();

describe('convert', () => {

  describe('@wip manifest', () => {
    beforeEach(async () => {
      await s3.deleteObject({
        Bucket: config.awsBucket,
        Key: 'test/test-key',
      }).promise();

      let manifest = {
        version: 1,
        items: [
          {
            name: "simplescale.wav",
            data: (await fs.readFile('./test/examples/simplescale.wav')).toString('base64'),
            targets: [
              { format: "mp3" }
            ],
          }
        ]
      };

      let Body = Buffer.from(JSON.stringify(manifest));

      await s3.putObject({
        Bucket: config.awsBucket,
        Key: 'test-key2',
        Body
      }).promise();
    });

    it('should process manifest file', async () => {
      // https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
      const event = {
        Records: [
          {
            s3: {
              bucket: {
                name: "test-bucket.localhost",
              },
              object: {
                key: "test-key2",
              }
            }
          }
        ]
      };

      await convert(event);

      const rsp = await s3.headObject({
        Bucket: config.awsBucket,
        Key: 'test/test-key2/out.mkv',
      }).promise();

      expect(rsp.ContentLength).to.be.above(0);
      expect(rsp.ETag).to.be.a('string');
      expect(rsp.ContentType).to.eql('video/mkv');

      let data = await s3.getObject({
        Bucket: config.awsBucket,
        Key: 'test/test-key2/out.mkv',
      }).promise();

      // DEBUG
      await fs.writeFile('/tmp/1.mp3', data.Body);
    });
  });
});
