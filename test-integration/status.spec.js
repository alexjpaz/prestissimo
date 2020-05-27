const supertest = require('supertest');
const { expect } = require('chai');

const {
  request,
  getAccessToken,
} = require('./common');

describe('status', () => {

  beforeEach(async () => {
    token = await getAccessToken();
  });


  it('OK', async () => {
    await request.get('/api/status')
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect((rsp) => {
        expect(rsp.body.status).to.eql("OK");

        // TODO
        console.log(rsp.text);
      });
    ;
  });


});
