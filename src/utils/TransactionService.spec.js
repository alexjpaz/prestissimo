const { expect } = require('chai');

const generateId = require('./generateId');

const { TransactionService } = require('./TransactionService');

describe('TransactionService', () => {
  let userId;

  let service;

  beforeEach(() => {
    userId = generateId();
    service = new TransactionService();
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

  it('findAll', async () => {
    let items

    items = await service.findAll(userId);

    expect(items.length).to.be.eql(0);

    let creates = [
      await service.create(userId),
      await service.create(userId),
      await service.create(userId),
    ];

    creates = await Promise.all(creates);

    items = await service.findAll(userId);

    expect(items.length).to.be.eql(creates.length);

    //expect(items[0].id).to.eql(creates[creates.length-1].transactionId, "Should be ordered - last item created is first item returned");
  });

  it('find', async () => {
    let item;

    item = await service.create(userId);

    item = await service.find(userId, item.transactionId);

    expect(item.status).to.be.eql("CREATED");
    expect(item.userId).to.be.eql(userId);
  });
});
