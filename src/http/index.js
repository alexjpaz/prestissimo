const serverless = require('serverless-http');

const Router = require('./router');
const Authorizer = require('./authorizer');

module.exports.router = serverless(Router());
module.exports.authorizer = Authorizer();
