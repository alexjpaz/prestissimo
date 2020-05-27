if(process.env.LAMBDA_TASK_ROOT) {
  // FIXME - Hacky!
  process.env.PATH = `${process.env.LAMBDA_TASK_ROOT || './'}/opt`;

  console.info("PATH=${process.env.PATH}");
}
module.exports.convert = require('./convert').convert;
module.exports.http = require('./http');
