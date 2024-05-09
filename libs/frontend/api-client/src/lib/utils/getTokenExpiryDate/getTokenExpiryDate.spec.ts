import { Settings } from 'luxon';
import getTokenExpiryDate from './getTokenExpiryDate';

describe('getTokenExpiryDate', () => {
  Settings.defaultZone = 'Greenwich';
  Settings.now = () => new Date(Date.UTC(2023, 0, 1, 0, 0, 0)).valueOf();

  it('should return token expiry date', () => {
    const expiresIn = 300;
    const tokenExpiryDate = getTokenExpiryDate(expiresIn);
    expect(String(tokenExpiryDate)).toEqual('2023-01-01T00:05:00.000+00:00');
  });
});
