const config = require('config');
const express = require('express');
const multer  = require('multer');

const os = require('os');

const AWS = require('../utils/aws');
const { logger } = require('../utils/logger');
const { TransactionService } = require('../utils/TransactionService');

const fs = require('fs').promises;

const { Status } = require('./status');
const { Transactions } = require('./transactions');
const { Debug } = require('./debug');
const { User } = require('./user');
const { html5fallback } = require('./html5fallback');

const defaultProps = () => ({
  s3: new AWS.S3(),
  transactionService: TransactionService.standard(),
});

const Router = (props = defaultProps()) => {
  const {
    s3,
    transactionService,
  } = props;

  const app = express();

  const upload = multer({ dest: os.tmpdir() })

  app.get('/ping', (req, res, next) => {
    return res.send({
      version: process.env.GIT_SHA,
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', User());

  app.use('/api', [
    Status(),
    Transactions({ transactionService }),
  ]);

  app.use('/restricted', [
    Debug()
  ]);

  app.use((req, res, next) => {
    if(req.originalUrl === "/index.html") {
      return next();
    }

    if(req.originalUrl === "/") {
      return next();
    }

    return express.static('public')(req, res, next);
  });

  app.get('*', html5fallback());

  return app;
};

module.exports = Router;
