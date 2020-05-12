const os = require('os');
const fsp = require('fs').promises;
const path = require('path');

const { promisify } = require('util');

const { logger } = require('../utils/logger');

const createTempFile = async (name = Math.random().toString()) => {
  const handler = {};

  const tempPath = path.join(os.tmpdir(), 'presstisimo');
  const outputDir = await fsp.mkdtemp(tempPath);
  const outputPath = path.join(outputDir,  name);

  handler.path = outputPath;

  handler.cleanup = async () => {
    try {
      await fsp.unlink(outputPath);
      logger.debug("Cleaned up tempFile", outputPath);
    } catch(e) {
      logger.warn("Failed to clean up tempFile", outputPath);
      logger.error(e);
    }
  };

  handler.write = async (data) => {
    return await fsp.writeFile(outputPath, data);
  };

  handler.read = async (data) => {
    return await fsp.readFile(outputPath);
  };

  await handler.write(Buffer.alloc(0));

  return handler;
};

module.exports = createTempFile;
