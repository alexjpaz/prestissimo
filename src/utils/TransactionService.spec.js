const { expect } = require('chai');

const generateId = require('./generateId');

const { TransactionService } = require('./TransactionService');

describe('TransactionService', () => {
  let randomUserId;
  let userId;

  let service;

  beforeEach(() => {
    userId = generateId();
    randomUserId = userId;
    service = TransactionService.standard();
  });

  it('should be constructed', () => {
  });

  describe('create', () => {
    let createUserId;
    let rsp;

    beforeEach(async () => {
      if(!rsp) {
        createUserId = userId;
        rsp = await service.create(createUserId);
      }
    });

    it('should have a userId', async () => {
      expect(rsp.userId).to.be.eql(createUserId);
    });

    it('should have a transactionId', async () => {
      expect(rsp.transactionId).to.be.a("String");
    });

    it('should have an upload object', async () => {
      expect(rsp.upload).to.be.a("Object");
    });

    describe('should have an signed URL', () => {

      it('httpMethod', () => {
        expect(rsp.upload.httpMethod).to.be.eql("PUT");
      });

      it('AWSAccessKeyId sanity', () => {
        expect(rsp.upload.url).to.include("AWSAccessKeyId");
      });

      it('userId' , () => {
        expect(rsp.upload.url).to.include(createUserId);
      });

      it('transactionId' , () => {
        expect(rsp.upload.url).to.include(encodeURIComponent(rsp.transactionId));
      });
    });
  });

  describe('findAll', () => {
    let userId = generateId();
    let items;
    let creates;

    beforeEach(async () => {
      if(items) {
        return;
      }

      items = await service.findAll(userId);

      expect(items.length).to.be.eql(0);

      creates = [
        await service.create(userId),
        await service.create(userId),
        await service.create(userId),
      ];

      creates = await Promise.all(creates);

      creates = creates.map((c, index) => {
        c.order = index;
        return c;
      });

      items = await service.findAll(userId);
    });

    it('should return list of transactions', () => {
      expect(items.length).to.be.eql(creates.length);
    });

    it('should return a list of transaction in descending order', () => {
      expect(items[0].transactionId).to.eql(creates[creates.length-1].transactionId, "Should be ordered - last item created is first item returned");
    });
  });

  it('find', async () => {
    let item;

    item = await service.create(userId);

    item = await service.find(userId, item.transactionId);

    expect(item.status).to.be.eql("CREATED");
    expect(item.userId).to.be.eql(userId);
  });
});
