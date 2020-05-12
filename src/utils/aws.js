const config = require('config');

const AWS = require('aws-sdk');

AWS.config.update({
  region: config.awsRegion,
  endpoint: config.awsEndpoint,
  s3ForcePathStyle: true // TODO
});

module.exports = AWS;
