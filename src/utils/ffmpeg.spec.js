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

  const convert = async (input, output) => {
    const command = ffmpeg(input)
      .output(output)

    await ffmpeg.runAsync(command);
  };

  describe('m4a', () => {
    let input = './test/examples/simplescale.m4a';

    it('mp3', async () => {
      const output = path.join(tempdir, './outfile.mp3');
      await convert(input, output);
    });

    it('wav', async () => {
      const output = path.join(tempdir, './outfile.wav');
      await convert(input, output);
    });

    it('png', async () => {
      const output = path.join(tempdir, './outfile.png');
      await convert(input, output);
    });

    it.skip('metadata', async () => {
      const output = path.join(tempdir, './outfile.txt');
      await convert(input, output);
    });
  });

  describe('wav', () => {
    let input = './test/examples/simplescale.wav';

    it('mp3', async () => {
      const output = path.join(tempdir, './outfile.mp3');
      await convert(input, output);
    });

    it('wav', async () => {
      const output = path.join(tempdir, './outfile.wav');
      await convert(input, output);
    });
  });

  describe('aif', () => {
    let input = './test/examples/simplescale.aif';

    it('mp3', async () => {
      const output = path.join(tempdir, './outfile.mp3');
      await convert(input, output);
    });

    it('wav', async () => {
      const output = path.join(tempdir, './outfile.wav');
      await convert(input, output);
    });
  });
});
