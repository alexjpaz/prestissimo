const config = require('config');

let pino = require('pino')(Object.assign({
    customLevels: {
      log: 35
    }
  },
  config.logger,
));

let appenders = {
  pino,
  console,
};

let logger = appenders[config.logger.appender];

if(!logger) {
  logger = pino;
}

logger.info("logger initialized", config.logger);

module.exports.logger = logger;


//module.exports.logger = console;
