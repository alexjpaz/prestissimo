beforeAll(() => {
});

it('should mount', () => {
  let root = null;

  root = document.querySelectorAll('[data-test-id="App-root"]');
  expect(root.length).toEqual(0);

  require('./');

  root = document.querySelectorAll('[data-test-id="App-root"]');
  expect(root.length).toEqual(1);
});
