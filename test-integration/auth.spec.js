const supertest = require('supertest');

let request = supertest(process.env.BASE_URL);

describe('auth', () => {
  it('should allow some pages to pass through', async () => {
    await request.get('/public/index.html')
      .expect(200)
    ;
  });

  describe('unauthorized', () => {
    it('should bounce when no credentials are provided', async () => {
      await request.get('/some-private-url')
        .expect(401)
      ;
    });
  });

  describe('authorized', () => {
    let token;
    before(() => {
      // TODO - get token!
    });

    it('should allow', async () => {
      await request.post('/some-private-url')
        .set("Authorization", `Bearer ${token}`)
        .expect(404)
      ;
    });
  });
});
