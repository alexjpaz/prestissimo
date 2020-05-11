const config = require('config');

const logger = require('pino')(Object.assign({
    customLevels: {
      log: 35
    }
  },
  config.logger,
));

logger.info("Pino logger initialized");

module.exports.logger = logger;
//module.exports.logger = console;
