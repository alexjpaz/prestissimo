const supertest = require('supertest');
const { expect } = require('chai');

const {
  request,
  getAccessToken,
} = require('./common');

beforeEach(async () => {
  token = await getAccessToken();
});

describe('status', () => {
  it('OK', async () => {
    await request.get('/api/status')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect((rsp) => {
        expect(rsp.body.status).to.eql("OK");
      });
    ;
  });
});
