const config = require('config');

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

  // TODO - iterate all items
  
  const item = manifest.items[0];

  console.log(item.name);

  const inputFile = await cacheObjectToFilesystem(Record);

  // FIXME
  const formats = [
    "out.wav",
    "out.mkv",
  ];

  try {
      logger.info('Converting record');

      const tasks = formats.map(async (format) => {

      try {

        //const rsp = await ffmpeg(inputFile, outputFile);
        let outputBuffer = item.data

        logger.log('Uploading converted object');

        await s3.putObject({
          Bucket: config.awsBucket,
          Key: `test/${Record.s3.object.key}/${format}`,
          ContentType: 'video/mkv',
          Body: outputBuffer.toString()
        }).promise();

      } finally {
        // Cleanuop
      }
    });

    await Promise.all(tasks);

  } catch(e) {
    throw e;
  } finally {
    await inputFile.cleanup();
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
