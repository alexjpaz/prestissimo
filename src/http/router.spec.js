const Router = require('./router');

const superagent = require('superagent');
it('ssssssss', () => {});

describe('http/router', () => {
  let request;

  beforeEach(() => {
    request = superagent(Router());
  });

  it('1', async () => {
    await request.post('/upload')
      .send("1");
    ;
  });
});
