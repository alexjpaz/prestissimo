const config = require('config');

const { logger } = require('./logger');

const AWS = require('./AWS');

const generateTransactionId = () => {
  let transactionId = `ts=${new Date().getTime().toString()}`;

  return transactionId;
};


// TODO - multiple implementations
class TransactionService {
  constructor() {
    this.s3 = new AWS.S3();
  }

  async find(userId, transactionId) {
    try {
      let Prefix = `users/${userId}/transactions/`;

      let Key = `${Prefix}${transactionId}/status.json`;

      const rsp = await this.s3.getObject({
        Bucket: config.awsBucket,
        Key,
      }).promise();

      let item = JSON.parse(rsp.Body);

      return{
        userId,
        transactionId,
        item,
      };
    } catch(e) {
      logger.error(e);
      throw e;
    }

  }

  async create(userId) {
    try {
      let transactionId = generateTransactionId();

      let transactionPrefix = `users/${userId}/transactions/${transactionId}`;

      const url = await this.s3.getSignedUrlPromise('putObject', {
        Bucket: config.awsBucket,
        Key: `inbox/${transactionPrefix}/manifest.json`,
        Expires: 300,
      });

      if(!url) {
        throw Error("InvalidStateException: no url created");
      }

      const rsp = await this.s3.putObject({
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
        userId,
        transactionId,
        upload: {
          httpMethod: 'PUT',
          url,
        },
      };

      return data;
    } catch(e) {
      logger.error(e);
      throw e;
    }

  }

  async findAll(userId) {
    try {
      let Prefix = `users/${userId}/transactions/`;

      const rsp = await this.s3.listObjectsV2({
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

      return {
        items,
      };
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }

  static standard() {
    return new TransactionService();
  }
}

module.exports = {
  TransactionService,
};
