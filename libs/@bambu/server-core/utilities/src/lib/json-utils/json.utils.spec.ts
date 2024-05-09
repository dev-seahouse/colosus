import { Stringify } from './index';

describe('libs/@bambu/server-core/utilities/src/lib/json-utils', () => {
  it('should return string', () => {
    const value = Stringify({ test: 1 });
    expect(typeof value).toEqual('string');
  });
});
