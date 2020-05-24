const { logger } = require('./logger');

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch(e) {
    logger.error(e);
    return next(e);
  }
};

module.exports = {
};
