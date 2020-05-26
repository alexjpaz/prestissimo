const config = require('config');

const stream = require('stream');

const ffmpeg = require('../utils/ffmpeg');

const { logger } = require('../utils/logger');

const AWS = require('../utils/aws');
const createTempFile = require('../utils/createTempFile');

const s3 = new AWS.S3();

const { TransactionService } = require('../utils/TransactionService');
// TODO
let transactionService = TransactionService.standard();

const getManifest = async (Record) => {
  const rsp = await s3.getObject({
    Bucket: Record.s3.bucket.name,
    Key: Record.s3.object.key,
  }).promise();

  let manifest = JSON.parse(rsp.Body);

  return manifest;
};

const convertAndUpload = async (item, context) => {
  let results = {};

  results.targets = [];

  try {
    logger.info({ context }, 'Converting item',);

    const tasks = item.targets.map(async (target) => {
      let { format } = target;

      try {
        let { dataUrl } = item.file.data;

        let base64Data = dataUrl.slice(dataUrl.indexOf(',')+1);

        let inputBuffer = Buffer.from(base64Data, 'base64');

        let inputStream = new stream.Readable();
        inputStream.push(inputBuffer);
        inputStream.push(null);

        let buffers = [];

        // TODO read metadat using ffprob
        // ffmpeg.ffprobe('/path/to/file.avi', function(err, metadata) {
        // console.dir(metadata);
        // });

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

        const command = ffmpeg(inputStream)
          .format(format)
          .output(outputStream);

        await ffmpeg.runAsync(command);

        logger.log({ length: outputBuffer.length },
          'Uploading converted object');

        let Key = [
          'conversions',
          'users',
          item.userId,
          'transactions',
          item.transactionId,
          format,
        ].join('/');

        await s3.putObject({
          Bucket: config.awsBucket,
          Key,
          ContentType: 'audio/x-audioish',
          Metadata: {
            format,
          },
          Body: outputBuffer,
        }).promise();

        results.targets.push({
          format,
          key: Key,
        });
      } finally {
        // Cleanuop
      }
    });

    await Promise.all(tasks);

    return results;

  } catch(e) {
    throw e;
  } finally {
    // Cleanup
  }

  logger.log('Sucessfully converted and uploaded object');
};

const processRecord = async (Record, context) => {
  try {
    const manifest = await getManifest(Record, context);

    currentStatus = await transactionService.find(
      manifest.userId,
      manifest.transactionId,
    );

    currentStatus.status = "PROCESSING";

    await transactionService.update(
      manifest.userId,
      manifest.transactionId,
      currentStatus,
    );

    // FIXME - iterate all items
    // Maybe invoke other lambdas?
    const item = manifest.items[0];

    // FIXME
    item.userId = manifest.userId;
    item.transactionId = manifest.transactionId;

    const results = await convertAndUpload(item, context);

    currentStatus.status = "SUCCESS";
    currentStatus.results = results;

    await transactionService.update(
      manifest.userId,
      manifest.transactionId,
      currentStatus,
    );

    const rsp = await s3.deleteObject({
      Bucket: Record.s3.bucket.name,
      Key: Record.s3.object.key,
    }).promise();

  } catch(e) {
    throw e;
  }

};

module.exports.convert = async (event, context) => {
  const promises = [];

  for(let Record of event.Records) {
    promises.push(processRecord(Record, context));
  }

  try {
    await Promise.all(promises);
  } catch(e) {
    logger.error(e);
    throw e;
  }

  return {
    Records: event.Records,
    status: "OK",
  };
};
