if(process.env.LAMBDA_TASK_ROOT) {
  // FIXME - Hacky!
  process.env.PATH = `${process.env.LAMBDA_TASK_ROOT || './'}/opt`;

  console.info("PATH=${process.env.PATH}");
}

const serverless = require('serverless-http');

const Router = require('./router');
const Authorizer = require('./authorizer');

module.exports.router = serverless(Router());
module.exports.authorizer = Authorizer();
