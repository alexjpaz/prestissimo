const supertest = require('supertest');

let request = supertest(process.env.BASE_URL);

describe('upload', () => {

  it('zero byte', async () => {
    const rsp = await request.post('/upload')
      .set('Content-Type', 'multipart/form-data')
      .type('form')
      .attach("file", Buffer.alloc(0))
      .expect(201)
    ;
  });

  it('file', async () => {
    const rsp = await request.post('/upload')
      .set('Content-Type', 'multipart/form-data')
      .type('form')
      .attach("file", "./test/Beachy.m4a")
      .then((rsp) => console.log(rsp))
      .expect(201)
    ;

    console.log(rsp);
  });
});
