const { expect } = require('chai');

const jsdom = require('jsdom');

const { waitFor } = require('@testing-library/dom');

const {
  baseUrl,
  aSecond,
} = require('./common');

describe('@wip ui', () => {

  it('html5fallback', async () => {
    let stage = "/local";

    let dom = await jsdom.JSDOM.fromURL(`${baseUrl}/html5-fallback`);
    console.log(dom.window.document);
    expect(dom.window.document.body.innerHTML).to.include('window.Prestissimo');
    expect(dom.window.document.body.innerHTML).to.include(`"RouterBasename": "${stage}"`);
  });

  describe('index.html', () => {
    let dom;

    beforeEach(async () => {
      const virtualConsole = new jsdom.VirtualConsole();

      dom = await jsdom.JSDOM.fromURL(`${baseUrl}/index.html`, {
        resources: 'usable',
        runScripts: "dangerously",
        virtualConsole
      });

      //virtualConsole.sendTo(console);
    });

    it('loads init html', async () => {
      expect(dom.window.document.body.innerHTML).to.include('id="loader"');
    });

    it('loads app', async () => {
      await new Promise((res, rej) => {
        dom.window.document.addEventListener('DOMContentLoaded', () => {
          setImmediate(res);
        });
      });

      expect(dom.window.document.body.innerHTML).not.to.include('id="loader"');
      expect(dom.window.document.body.innerHTML).to.include('data-test-id="App-root"');
    });
  });

  describe('debug', () => {
    let dom;

    beforeEach(async () => {
      const virtualConsole = new jsdom.VirtualConsole();

      dom = await jsdom.JSDOM.fromURL(`${baseUrl}/debug`, {
        resources: 'usable',
        runScripts: "dangerously",
        virtualConsole
      });

      //virtualConsole.sendTo(console);
    });

    it('loads debug page', async () => {
      await new Promise((res, rej) => {
        dom.window.document.addEventListener('DOMContentLoaded', () => {
          setImmediate(res);
        });
      });

      expect(dom.window.document.body.innerHTML).to.include('data-test-id="App-root"');

      await aSecond();

      expect(dom.window.document.body.innerHTML).to.include('version');

      // TODO assert current version
    });
  });

});
