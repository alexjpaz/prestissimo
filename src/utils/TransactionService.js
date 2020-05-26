const config = require('config');

const { logger } = require('./logger');

const AWS = require('./aws');

const Exception = require('./Exception');

class TransactionServiceError extends Exception {
}

class S3TransactionService {
  constructor(props = S3TransactionService.defaultProps()) {
    this.s3 = props.s3;
  }

  static defaultProps() {
    return {
      s3: new AWS.S3()
    };
  }

  /**
   * Generate a transaction key
   *
   * Note: According the docs "List results are always returned in UTF-8 binary order."
   *
   * Since we want the "findAll" method to return items ordered by the last insertion
   * this implementation will generate an encoded timestamp id that uses a very
   * large 64bit integer and subtract the current milliseconds. This will order the
   * keys in a descending order.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/ListingKeysUsingAPIs.html
   */
  generateTransactionId() {
    let millis = new Date().getTime();

    let max = BigInt(1) << BigInt(64);

    let ts = max - BigInt(millis);

    let transactionId = `ets=${ts}`;

    return transactionId;
  };

  throwError(message, cause) {
    logger.debug(cause);
    let err = new TransactionServiceError(message, cause);
    throw err;

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

      item = {
        ...item,
        userId,
        transactionId,
      };

      return item;
    } catch(e) {
      this.throwError(`Failed to find transaction userId=${userId},transactionId=${transactionId} `, e);
    }

  }

  async merge(userId, transactionId, input) {
    // FIXME - Eventually consistent!
    try {
      const current = await find(userId, transactionId);

      let updated = {
        ...current,
        ...input,
      };

      await this.update(userId, transactionId, updated);
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }

  async update(userId, transactionId, input) {
    // FIXME - Eventually consistent!
    //
    try {
      let Prefix = `users/${userId}/transactions/`;

      let Key = `${Prefix}${transactionId}/status.json`;

      await this.s3.putObject({
        Bucket: config.awsBucket,
        Key,
        Body: JSON.stringify(input),
      }).promise();
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }

  async create(userId) {
    try {
      let transactionId = this.generateTransactionId();

      let transactionPrefix = `users/${userId}/transactions/${transactionId}`;

      let manifestKey = `inbox/${transactionPrefix}/manifest.json`;

      const url = await this.s3.getSignedUrlPromise('putObject', {
        Bucket: config.awsBucket,
        Key: manifestKey,
        Expires: 300,
      });

      if(!url) {
        throw Error("InvalidStateException: no url created");
      }


      // TODO use update
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
          manifestKey,
          url,
        },
      };

      return data;
    } catch(e) {
      logger.error(e);
      throw e;
    }

  }

  async findAll(userId, nextToken) {
    try {
      let Prefix = `users/${userId}/transactions/`;

      const rsp = await this.s3.listObjectsV2({
        Bucket: config.awsBucket,
        Prefix,
        ContinuationToken: nextToken,
      }).promise();

      let items = rsp.Contents
        .map(c => c.Key)
        .map(c => c.replace(Prefix, ''))
        .map(c => c.replace('/status.json', ''))
        .map(c => ({ transactionId: c }))
      ;

      if(rsp.IsTruncated) {
        items.nextToken = res.NextContinuationToken
      }

      return items;
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }


}

class TransactionService {
  static standard() {
    return new S3TransactionService();
  }
}

module.exports = {
  TransactionService,
};
