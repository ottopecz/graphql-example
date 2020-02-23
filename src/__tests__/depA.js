const depA = require('../depA');

describe('The depA module', () => {
  it('should export a placeholder object', () => {
    expect(depA).toEqual({ foo: 'bar' });
  });
});
