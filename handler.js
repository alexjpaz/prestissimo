// FIXME - Hacky!
process.env.PATH = `${process.env.LAMBDA_TASK_ROOT || './'}/opt`;

const { logger } = require('./utils/logger');

const { convert } = require('./convert');

module.exports.convert = async (event, context) => {
  logger.info("convert", event, context);

  try {
    await convert(event, context);
  } catch(e) {
    logger.error(e);
    throw e;
  }
};
