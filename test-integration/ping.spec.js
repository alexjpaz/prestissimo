const supertest = require('supertest');

const {
  request,
  getAccessToken,
} = require('./common');

describe('ping', () => {
  beforeEach(async () => {
    token = await getAccessToken();
  });

  it('root @fails-locally', async () => {
    await request.get('/')
      .set("Authorization", `Bearer ${token}`)
      .expect(200, /prestissimo/)
    ;
  });
});

