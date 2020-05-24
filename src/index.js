if(process.env.LAMBDA_TASK_ROOT) {
  // FIXME - Hacky!
  //process.env.PATH = `${process.env.LAMBDA_TASK_ROOT || './'}/opt`;
}
module.exports.convert = require('./convert').convert;
module.exports.http = require('./http');
