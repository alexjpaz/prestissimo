const supertest = require('supertest');

let request = supertest(process.env.BASE_URL);

it('upload', async () => {
  await request.post('/upload')
        .set('Content-Type', 'multipart/form-data')
        .type('form')
        .attach("file", Buffer.alloc(0))
        .expect(201)
  ;
});
