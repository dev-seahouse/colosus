import { fromIdToKey } from './fromIdToKey';

describe('fromPortfolioIdToKey', () => {
  it('should return the correct key', () => {
    const testAcc = {};
    const testCurr = { id: 'myId', key: 'myKey' };
    const expected = { myId: 'myKey' };
    expect(fromIdToKey(testAcc, testCurr)).toEqual(expected);
  });
});
