const supertest = require('supertest');

const {
  request,
  getAccessToken,
} = require('./common');

beforeEach(async () => {
  token = await getAccessToken();
});

it('root', async () => {
  await request.get('/')
    .set("Authorization", `Bearer ${token}`)
    .expect(200, /prestissimo/)
  ;
});


