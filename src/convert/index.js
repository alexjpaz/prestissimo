const config = require('config');

const { spawn } = require('child_process');

const { logger } = require('../utils/logger');

const AWS = require('../utils/aws');
const createTempFile = require('../utils/createTempFile');

const s3 = new AWS.S3();

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

const ffmpeg = async (inputFile, outputFile, args = []) => {
  const ffmpegArgs = [
    '-y',
    '-i', inputFile.path,
    outputFile.path,
    ...args
  ];

  logger.info('Spawning ffmpeg with args', args.join(' '));

  const child = spawn('ffmpeg', ffmpegArgs);

  let data = ""

  for await (const chunk of child.stdout) {
    data += chunk;
  }

  let error = "";
  for await (const chunk of child.stderr) {
    error += chunk;
  }

  const exitCode = await new Promise( (resolve, reject) => {
    child.on('close', resolve);
  });

  if(exitCode !== 0) {
    logger.warn("ffmpeg exited with non-zero status", data, error);
  }

  return {
    data,
    exitCode,
    error,
  }

};

const convertAndUpload = async (Record) => {
  const inputFile = await cacheObjectToFilesystem(Record);

  // FIXME
  const formats = [
    "out.wav",
    "out.mkv",
  ];

  try {
    logger.info('Converting record');

    const tasks = formats.map(async (format) => {
      const outputFile = await createTempFile(format); // TODO

      try {
        const rsp = await ffmpeg(inputFile, outputFile);

        if(rsp.exitCode !== 0) {
          throw new Error("Failed to convert object: ExitCode=" + rsp.exitCode);
        }

        logger.log('Uploading converted object');

        await s3.putObject({
          Bucket: config.awsBucket,
          Key: `test/${Record.s3.object.key}/${format}`,
          ContentType: 'video/mkv',
          Body: await outputFile.read(),
        }).promise();

      } finally {
        await outputFile.cleanup();
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
  for(let Record of event.Records) {
    try {
      await convertAndUpload(Record);
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }
};
