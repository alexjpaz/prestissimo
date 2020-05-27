const { expect } = require('chai');

const supertest = require('supertest');
const superagent = require('superagent');

const {
  request,
  getAccessToken,
} = require('./common');

describe('transactions', () => {
  let token;

  beforeEach(async () => {
    token = await getAccessToken();
  });

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

    const req = await superagent.put(url)
      .send(buffer);

    // TODO - Assert that the manifest was accepted
    rsp = await request.get(`/api/transactions/${transactionId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
    ;

    // TODO - Should be ACCEPTED
    expect(rsp.body.data.item.status).to.eql("CREATED");
  })
});
