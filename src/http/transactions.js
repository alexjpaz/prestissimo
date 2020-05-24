const config = require('config');
const express = require('express');

const { logger } = require('../utils/logger');
const { TransactionService } = require('../utils/TransactionService');

const defaultProps = () => ({
  s3: new AWS.S3(),
  transactionService: TransactionService.standard()
});

const Transactions = (props = defaultProps()) => {
  const {
    s3,
    transactionService,
  } = props;

  const app = express();

  app.get('/transactions', async (req, res, next) => {
    try {
      let userId = req.user.userId;

      const items = await transactionService.findAll(userId);

      return res.json({
        data: items,
      });
    } catch(e) {
      logger.error(e);
      next(e);
    }
  });

  app.get('/transactions/:id*', async (req, res, next) => {
    try {
      let userId = req.user.userId;

      let transactionId = [req.params.id, req.params[0]].join('');
      const item = await transactionService.find(userId, transactionId);

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
      let userId = req.user.userId;

      const data = await transactionService.create(userId);

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

