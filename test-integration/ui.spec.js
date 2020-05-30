const { expect } = require('chai');

const jsdom = require('jsdom');

const {
  baseUrl,
} = require('./common');

describe('@wip ui', () => {

  describe('index.html', () => {
    let dom;

    beforeEach(async () => {
      const virtualConsole = new jsdom.VirtualConsole();

      dom = await jsdom.JSDOM.fromURL(`${baseUrl}/index.html`, {
        resources: 'usable',
        runScripts: "dangerously",
        virtualConsole
      });
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

      dom = await jsdom.JSDOM.fromURL(`${baseUrl}/index.html#/debug`, {
        resources: 'usable',
        runScripts: "dangerously",
        virtualConsole
      });
    });

    it('loads debug page', async () => {
      await new Promise((res, rej) => {
        dom.window.document.addEventListener('DOMContentLoaded', () => {
          setImmediate(res);
        });
      });

      expect(dom.window.document.body.innerHTML).to.include('data-test-id="App-debug"');
    });
  });

});
