const express = require('express');

const config = require('config');

const AWS = require('../utils/aws');

const { logger } = require('../utils/logger');

const { JWKS, JWT } = require('jose');

const Debug = () => {
  if(process.env.NODE_ENV !== 'test') {
    return (req, res, next) => {
      next();
    };
  }

  logger.warn("RESTRICTED DEBUG ROUTE IS ENABLED!!!");

  const app = express();

  const lambda = new AWS.Lambda({
    apiVersion: '2031',
    endpoint: 'http://localhost:3002'
  });

  const s3 = new AWS.S3();

  app.get('/debug/tokens/user', async (req, res, next) => {
    try {
      let path = config.authorizer.jwksUri.replace('file://','');
      const buffer = await fs.readFile(path);
      jwks = JSON.parse(buffer.toString());
      keyStore = JWKS.asKeyStore(jwks);
      let key = keyStore.all()[0];

      let token = JWT.sign(
        {
          name: 'test@test.com.com',
          email: 'test@test.com.com',
          nickname: 'test',
          scope: 'test'
        },
        key,
        {
          subject: "fake|user123",
          audience: config.authorizer.audience,
          issuer: config.authorizer.issuer,
        }
      );

      return res.send({
        token,
      });
    } catch(e) {
      next(e);
    }
  });


  app.get('/debug/process-inbox', async (req, res, next) => {
    try {
      const uploads = await s3.listObjectsV2({
        Bucket: config.awsBucket,
        Prefix: "inbox/"
      }).promise();

      console.log("Processing inbox", uploads.Contents);

      let Records = uploads.Contents
        .map(c => c.Key)
        .map(key => ({
          s3: {
              bucket: {
                name: config.awsBucket,
              },
              object: {
                key,
              }
            }
        }))
      ;

      const response = await lambda.invoke({
        FunctionName: "prestissimo-local-convert",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({
          Records
        }),
      }).promise();

      res.send(response);
    } catch(e) {

      return res.status(500).send({
        error: e,
      });
    }
  });

  return app;
};

module.exports = {
  Debug,
};
