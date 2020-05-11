const serverless = require('serverless-http');

const Router = require('./router');

module.exports.router = serverless(Router());
