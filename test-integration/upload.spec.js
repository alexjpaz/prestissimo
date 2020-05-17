const { expect } = require('chai');

const supertest = require('supertest');
const superagent = require('superagent');

const {
  request,
  getAccessToken,
} = require('./common');

describe('upload', () => {
  let token;

  before(async () => {
    token = await getAccessToken();
  });

  it('should create a signed PUT url', async () => {
    rsp = await request.put('/upload/signed-url')
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const url = rsp.text;

    expect(url).to.include('prestissimo');
    expect(url).to.include('x-amz-security-token');

    const buffer = Buffer.from("test");

    const req = await superagent.put(url)
      .send(buffer);
  })

  it('should create a signed POST url', async () => {
    rsp = await request.post('/upload/signed-url')
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    let data = rsp.body;

    const req = superagent.post(data.url);

    req.type('form');

    Object.keys(data.fields).map((key) => {
      req.field(key, data.fields[key]);
    });

    req.field("key", "uploads/raw/test");

    const buffer = Buffer.from("test23");

    req.attach("file", buffer)

    let { statusCode } = await req;

    expect(statusCode).to.eql(204);
  })
});
