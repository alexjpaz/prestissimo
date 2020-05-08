const { expect } = require('chai');

const { convert } = require('./');

it('convert', async () => {
  const { data } = await convert();

  expect(data).to.include('FFmpeg developers');
});
