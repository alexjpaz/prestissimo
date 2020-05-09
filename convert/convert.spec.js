const { expect } = require('chai');

const { convert } = require('./');

it('convert', async () => {
  const { data } = await convert();

  expect(data).to.include('FFmpeg developers');
});

it('should process an s3 event', async () => {
  // https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
  //
  const event = {
    Records: [
      {
        s3: {
          bucket: {
            name: "test-bucket",
          },
          object: {
            key: "test-key",
          }
        }
      }
    ]
  };

  const result = await convert(event);

  expect(result.event).to.eql(event);
});

it('should process an s3 event @wip', async () => {
  // https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
  //
  const event = {
    Records: [
      {
        s3: {
          bucket: {
            name: "prestissimo-dev",
          },
          object: {
            key: "uploads/songs/Beachy.m4a",
          }
        }
      }
    ]
  };

  const result = await convert(event);
});

