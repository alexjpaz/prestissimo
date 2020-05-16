const supertest = require('supertest');

let request = supertest(process.env.BASE_URL);

describe('upload', () => {

  it('should create a signed PUT url', () => {
    rsp = await request.post('/upload/signed-url')
      .expect(200);

    expect(rsp).to.eql(1);
  })

  it('should create a signed POST url', () => {
    rsp = await request.post('/upload/signed-url')
      .expect(200);

    expect(rsp).to.eql(1);
  })
});
