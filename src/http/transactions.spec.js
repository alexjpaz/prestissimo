const config = require('config');
const express = require('express');
const sinon = require('sinon');
const { expect } = require('chai');
const superagent = require('superagent');
const supertest = require('supertest');

const fs = require('fs').promises;

const Router = require('./router');

const AWS = require('../utils/aws');

const generateId = require('../utils/generateId');

describe('transactions', () => {
  let request;

  let mockS3;

  let userId = generateId();

  beforeEach(() => {
    mockS3 = new AWS.S3();

    let app = express();

    app.use((req, res, next) => {
      req.user = {
        userId,
      };
      next();
    });

    app.use(Router({
      s3: mockS3
    }));

    request = supertest(app);
  });

  describe('@wip transactions', () => {

    let transactionId;

    beforeEach(async () => {
      let timestamp = new Date();

      transactionId = `${timestamp.toISOString()}/${generateId()}`;

      let transaction = {
        id: transactionId,
        timestamp,
      };

      let Body = JSON.stringify(transaction);

      await mockS3.putObject({
        Bucket: config.awsBucket,
        Key: `users/${userId}/transactions/${transactionId}`,
        Body,
      }).promise();
    });

    it('should list transactions', async () => {
      const rsp = await request.get('/api/transactions')
        .expect(200)
      ;

      expect(rsp.body.data.items[0].id).to.eql(transactionId);
    });

    it('should fetch a transaction', async () => {
      const rsp = await request.get(`/api/transactions/${transactionId}`)
        .expect(200)
      ;

      expect(rsp.body.data.item.id).to.eql(transactionId);
    });
  });
});
