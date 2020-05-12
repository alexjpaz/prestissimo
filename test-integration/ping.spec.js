const supertest = require('supertest');

let request = supertest(process.env.BASE_URL);

it('root', async () => {
  await request.get('/')
    .expect(200, /prestissimo/)
  ;
});
