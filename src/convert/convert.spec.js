const config = require('config');
const fs = require('fs').promises;

const { expect } = require('chai');

const { convert } = require('./');

const { logger } = require('../utils/logger');
const AWS = require('../utils/aws');
const s3 = new AWS.S3();

const generateId = () => {
  // Does not need to be crypto secure
  const data = new Date().getTime().toString();
  return require('crypto').createHash('sha1').update(data).digest('hex');
};

describe('convert', () => {

  describe('manifest', () => {
    let manifest;
    beforeEach(async () => {
      let data = await fs.readFile('./test/examples/simplescale.wav');

      let dataUrl = data.toString('base64');

      manifest = {
        version: 1,
        items: [
          {
            id: generateId(),
            coverart: Buffer.alloc(0),

            file: {
              name: "simplescale.wav",
              type: "audio/wav",
              size: data.length,
              data: {
                dataUrl,
              },
              lastModified: new Date().getTime(),
              lastModifiedDate: new Date(),
            },
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

      const context = {
        awsRequestId: generateId(),
      };

      await convert(event, context);

      let manifestItem = manifest.items[0];
      let manifestId = manifestItem.id;

      let objects = await s3.listObjectsV2({
        Bucket: config.awsBucket,
        Prefix: `conversions/${manifestId}/${context.awsRequestId}`
      }).promise();

      expect(objects.KeyCount).to.be.above(0);

      let { Key } = objects.Contents.find(i => i);

      let head = await s3.headObject({
        Bucket: config.awsBucket,
        Key,
      }).promise();

      expect(head.ContentLength).to.be.above(0);
      expect(head.ETag).to.be.a('string');
      //expect(head.ContentType).to.eql('video/mkv');
      expect(head.Metadata.manifestid).to.eql(manifestId);
      expect(head.Metadata.format).to.eql(manifestItem.targets[0].format);
    });
  });
});
