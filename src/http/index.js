const serverless = require('serverless-http');

const Router = require('./router');
const Authorizer = require('./authorizer');

module.exports.router = async (event, context) => {
  if(event.requestContext.stage === 'local') {
    if(event.path === '') {
      return {
        statusCode: 307,
        headers: {
          Location: "/local/start"
        }
      };
    }
  }

  return await serverless(Router())(event, context);
};

module.exports.authorizer = Authorizer();
