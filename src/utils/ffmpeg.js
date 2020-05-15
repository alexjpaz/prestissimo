const ffmpeg = require('fluent-ffmpeg');
const { logger } = require('./logger');

/**
 * Run an ffmpeg command in an async/await manner
 * @see https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/710
 */
const asyncRun = async (command) => {
  return new Promise((resolve, reject) => {
    command
      .on('progress', (progress) => {
        logger.debug(progress, "ffmpeg progress");
      })
      .on('error', (err) => {
        logger.error(err, "ffmpeg error");
        reject(err);
      })
      .on('end', () => {
        logger.info("ffmpeg finished");
        resolve();
      })
      .run();
    ;
  });
};

exports.foo = async (input, output) => {
  const command = ffmpeg(input)
    .output(output)

  await asyncRun(command);
};
