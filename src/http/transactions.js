const config = require('config');
const express = require('express');
const { logger } = require('../utils/logger');

const defaultProps = () => ({
  s3: new AWS.S3()
});

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
        .map(c => ({ id: c }))
      ;

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

      let Key = `${Prefix}${transactionId}`;

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

  return app;
};

module.exports = {
  Transactions,
};

