const { expect } = require('chai');

const supertest = require('supertest');
const superagent = require('superagent');

const {
  request,
  getAccessToken,
  aSecond,
} = require('./common');

describe('transactions', () => {
  let token;

  beforeEach(async () => {
    token = await getAccessToken();
  });

  describe('create', () => {
    let transaction;

    beforeEach(async () => {
      if(transaction) return;

      let rsp;

      rsp = await request.put('/api/transactions')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
      ;

      transaction = rsp.body.data;
    });

    it('transactionId', () => {
      let { transactionId } = transaction;

      expect(transactionId).to.be.a("String");

    });

    it('url', () => {
      let { url } = transaction.upload;
      expect(url).to.include('x-amz-security-token');
    });

  });

  describe('upload', () => {
    it('upload a test file using a created transaction', async () => {
      let rsp;

      rsp = await request.put('/api/transactions')
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
      ;

      let { transactionId } = rsp.body.data;

      const { url } = rsp.body.data.upload;

      let data = rsp.body;

      expect(url).to.include('x-amz-security-token');

      const buffer = Buffer.from("test");

      try {
        await superagent.put(url)
          .send(buffer);
      } catch(e) {
        throw new Error("Failed to upload file: " + e.message);
      }

      await aSecond(1000);

      for(let retries=0; retries<10; retries++) {
        // TODO - Assert that the manifest was accepted
        try {
          rsp = await request.get(`/api/transactions/${transactionId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
          ;

          // TODO - Should be ACCEPTED
          expect(rsp.body.data.item.status).to.eql("CREATED");
          break;
        } catch(e) {
          await aSecond();
        }
      }
    })
  });
});
