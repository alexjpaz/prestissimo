const ffmpeg = require('./ffmpeg');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const { logger } = require('./logger');

describe('ffmpeg', () => {
  let tempdir;

  beforeEach(async () => {
    tempdir = await fs.mkdtemp(`${os.tmpdir()}${path.sep}`);
    logger.debug("tempdir=%s", tempdir);
  });

  describe('m4a', () => {
    let input = './test/examples/simplescale.m4a';

    it('mp3', async () => {
      const output = path.join(tempdir, './outfile.mp3');
      await ffmpeg.foo(input, output);
    });

    it('wav', async () => {
      const output = path.join(tempdir, './outfile.wav');
      await ffmpeg.foo(input, output);
    });

    it('png', async () => {
      const output = path.join(tempdir, './outfile.png');
      await ffmpeg.foo(input, output);
    });

    it.skip('metadata', async () => {
      const output = path.join(tempdir, './outfile.txt');
      await ffmpeg.foo(input, output);
    });
  });

  describe('wav', () => {
    let input = './test/examples/simplescale.wav';

    it('mp3', async () => {
      const output = path.join(tempdir, './outfile.mp3');
      await ffmpeg.foo(input, output);
    });

    it('wav', async () => {
      const output = path.join(tempdir, './outfile.wav');
      await ffmpeg.foo(input, output);
    });
  });

  describe('aif', () => {
    let input = './test/examples/simplescale.aif';

    it('mp3', async () => {
      const output = path.join(tempdir, './outfile.mp3');
      await ffmpeg.foo(input, output);
    });

    it('wav', async () => {
      const output = path.join(tempdir, './outfile.wav');
      await ffmpeg.foo(input, output);
    });
  });
});
