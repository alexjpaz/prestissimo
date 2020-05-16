const supertest = require('supertest');

let request = supertest(process.env.BASE_URL);

describe('auth', () => {
  it('should allow some pages to pass through', async () => {
    await request.get('/public/index.html')
      .expect(200)
    ;
  });

  it('should bounce when no credentials are provided', async () => {
    await request.get('/some-private-url')
      .expect(401)
    ;
  });
});
