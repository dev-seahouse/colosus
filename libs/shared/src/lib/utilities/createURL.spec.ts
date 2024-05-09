import { createURL } from './createURL';

describe('createURL', () => {
  describe('createURL', () => {
    it('should return correct string', () => {
      const urlString = createURL({
        url: 'http://test.com',
        params: {
          foo: 'bar',
          baz: 'qux',
        },
        hashParams: {
          fooHash: 'barHash',
          bazHash: 'quxHash',
        },
      });
      expect(urlString).toEqual(
        'http://test.com?baz=qux&foo=bar#bazHash=quxHash&fooHash=barHash'
      );
    });
  });
});
