beforeAll(() => {
  let root = document.createElement('div');
  root.id = 'app';

  let loader = document.createElement('div')
  loader.id = 'loader';

  document.body.appendChild(root);
  document.body.appendChild(loader);
});

it('should mount', () => {
  let root = null;
  let loader = null;

  root = document.querySelectorAll('[data-test-id="App-root"]');
  loader = document.querySelectorAll('#loader');

  expect(root.length).toEqual(0);
  expect(loader.length).toEqual(1);

  require('./');

  root = document.querySelectorAll('[data-test-id="App-root"]');
  loader = document.querySelectorAll('#loader');

  expect(root.length).toEqual(1);
  expect(loader.length).toEqual(0);
});
