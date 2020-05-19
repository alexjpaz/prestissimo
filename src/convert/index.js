const config = require('config');

const stream = require('stream');

const ffmpeg = require('../utils/ffmpeg');

const { logger } = require('../utils/logger');

const AWS = require('../utils/aws');
const createTempFile = require('../utils/createTempFile');

const s3 = new AWS.S3();

const getManifest = async (Record) => {
  const rsp = await s3.getObject({
    Bucket: Record.s3.bucket.name,
    Key: Record.s3.object.key,
  }).promise();

  let manifest = JSON.parse(rsp.Body);

  return manifest;
};

const cacheObjectToFilesystem = async (inputRecord) => {
  const tempFile = await createTempFile();

  logger.info("Caching object", inputRecord.s3.bucket.name, inputRecord.s3.object.key);

  const rsp = await s3.getObject({
    Bucket: inputRecord.s3.bucket.name,
    Key: inputRecord.s3.object.key,
  }).promise();

  await tempFile.write(rsp.Body);

  return tempFile;
};

const convertAndUpload = async (Record) => {
  const manifest = await getManifest(Record);

  // FIXME - iterate all items
  // Maybe invoke other lambdas?
  const item = manifest.items[0];

  try {
    logger.info('Converting record');

    const tasks = item.targets.map(async (target) => {
      let { format } = target;

      try {
        // FIXME - move this out!
        let inputBuffer = Buffer.from(item.data, 'base64');
        let inputStream = new stream.Readable();
        inputStream.push(inputBuffer);
        inputStream.push(null);

        let buffers = [];

        let outputBuffer ;

        let outputStream = new stream.Writable({
          write(chunk, env, next) {
            buffers.push(chunk);
            next();
          },
          final(cb) {
            outputBuffer = Buffer.concat(buffers);
            cb();
          }
        });

        const command = await ffmpeg(inputStream)
          .format('mp3')
          .output(outputStream);

        await ffmpeg.runAsync(command);

        logger.log('Uploading converted object');

        await s3.putObject({
          Bucket: config.awsBucket,
          Key: `test/${Record.s3.object.key}/${format}`,
          ContentType: 'video/mkv',
          Body: outputBuffer,
        }).promise();

      } finally {
        // Cleanuop
      }
    });

    await Promise.all(tasks);

  } catch(e) {
    throw e;
  } finally {
    // Cleanup
  }

  logger.log('Sucessfully converted and uploaded object');
};

module.exports.convert = async (event, context) => {
  const promises = [];

  for(let Record of event.Records) {
    promises.push(convertAndUpload(Record));
  }

  try {
    await Promise.all(promises);
  } catch(e) {
    logger.error(e);
    throw e;
  }
};
