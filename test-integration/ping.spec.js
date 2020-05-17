const supertest = require('supertest');

const {
  request,
  getAccessToken,
} = require('./common');

before(async () => {
  token = await getAccessToken();
});

it('root', async () => {
  await request.get('/')
    .set("Authorization", `Bearer ${token}`)
    .expect(200, /prestissimo/)
  ;
});
