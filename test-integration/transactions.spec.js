const { expect } = require('chai');

const supertest = require('supertest');
const superagent = require('superagent');

const {
  request,
  getAccessToken,
} = require('./common');

describe('upload', () => {
  let token;

  beforeEach(async () => {
    token = await getAccessToken();
  });

  it('should create a signed POST url', async () => {
    let rsp = await request.post('/api/transactions')
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    let data = rsp.body;

    expect(data.items.length).to.be.above(0);
  })
});
