const config = require('config');
const express = require('express');
const { logger } = require('../utils/logger');

const defaultProps = () => ({
  s3: new AWS.S3()
});

const generateTransactionId = () => {
  let transactionId = new Date().toISOString();

  return transactionId;
};

const Transactions = (props = defaultProps()) => {
  const { s3 } = props;

  const app = express();

  app.get('/transactions', async (req, res, next) => {
    try {
      let userId = req.user.userId;
      let Prefix = `users/${userId}/transactions/`;

      const rsp = await s3.listObjectsV2({
        Bucket: config.awsBucket,
        Prefix,
      }).promise();

      let items = rsp.Contents
        .map(c => c.Key)
        .map(c => c.replace(Prefix, ''))
        .map(c => c.replace('/status.json', ''))
        .map(c => ({ id: c }))
      ;

      items.reverse();

      return res.send({
        data: {
          items,
        }
      });
    } catch(e) {
      logger.error(e);
      next(e);
    }
  });

  app.get('/transactions/:id*', async (req, res, next) => {
    try {
      let userId = req.user.userId;
      let Prefix = `users/${userId}/transactions/`;

      let transactionId = [req.params.id, req.params[0]].join('');

      let Key = `${Prefix}${transactionId}/status.json`;

      const rsp = await s3.getObject({
        Bucket: config.awsBucket,
        Key,
      }).promise();

      let item = JSON.parse(rsp.Body);

      return res.send({
        data: {
          item,
        }
      });
    } catch(e) {
      logger.error(e);
      next(e);
    }
  });

  app.put('/transactions', async (req, res, next) => {
    try {
      let transactionId = generateTransactionId();

      let userId = req.user.userId;

      let transactionPrefix = `users/${userId}/transactions/${transactionId}`;

      const url = await s3.getSignedUrlPromise('putObject', {
        Bucket: config.awsBucket,
        Key: `inbox/${transactionPrefix}/manifest.json`,
        Expires: 300,
      });

      if(!url) {
        throw Error("InvalidStateException: no url created");
      }

      const rsp = await s3.putObject({
        Bucket: config.awsBucket,
        Key: `${transactionPrefix}/status.json`,
        ContentType: 'application/json',
        Body: JSON.stringify({
          last_updated: new Date(),
          status: "CREATED",
          manifestKey: `inbox/${transactionPrefix}/manifest.json`,
        })
      }).promise();

      let data = {
        transactionId,
        upload: {
          httpMethod: 'PUT',
          url,
        },
      };

      res.json({
        data
      });
    } catch(e) {
      logger.error(e);
      next(e);
    }
  });

  return app;
};

module.exports = {
  Transactions,
};

