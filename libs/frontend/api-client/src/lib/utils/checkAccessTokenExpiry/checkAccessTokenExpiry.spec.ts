import { Settings } from 'luxon';
import checkAccessTokenExpiry from './checkAccessTokenExpiry';

describe('checkAccessTokenExpiry', () => {
  Settings.defaultZone = 'Greenwich';
  Settings.now = () => new Date(Date.UTC(2023, 0, 1, 0, 0, 0)).valueOf();

  it('should return true if token has expired', () => {
    expect(checkAccessTokenExpiry('2022-12-01T00:05:00.000+00:00')).toEqual(
      true
    );
  });
});
