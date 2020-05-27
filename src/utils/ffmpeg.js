const ffmpeg = require('fluent-ffmpeg');

const stream = require('stream');

const { logger } = require('./logger');

/**
 * Run an ffmpeg command in an async/await manner
 * @see https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/710
 */
ffmpeg.runAsync = (command) => {
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

ffmpeg.statusCheck = async () => {
  const { promisify } = require('util');

  let result = {
  };

  let fns = [
    'getAvailableFormats',
    'getAvailableCodecs',
    'getAvailableEncoders',
    'getAvailableFilters',
  ].map(fn => promisify(ffmpeg[fn]));

  let promises = fns.map(fn => fn());

  result.status = "OK";

  // TODO - list available formats

  return result;
};

class BufferInputStream extends stream.Readable {
  constructor(props) {
    super(props);
    this.buffer = props.buffer;
  }

  read(size) {
    this.push(this.buffer);
    this.push(null);
  }

  static from(buffer) {
    return new BufferInputStream({
      buffer,
    });
  }
}

ffmpeg.BufferInputStream = BufferInputStream;

class BufferOutputStream extends stream.Writable {
  constructor(props) {
    super(props);
    this.buffers = [];
  }

  write(chunk, env, next) {
    this.buffers.push(chunk);
    next();
  }

  final(cb) {
    this.buffer = Buffer.concat(this.buffers);
    cb();
  }

  getBuffer() {
    return this.buffer;
  }
}

ffmpeg.BufferOutputStream = BufferOutputStream;

module.exports = ffmpeg;
