import { isValidNINO } from './OpenInvestAccountForm.utils';

describe('isValidNINO', () => {
  it('should return true for valid NINO', () => {
    expect(isValidNINO('AB123456A')).toBe(true);
    expect(isValidNINO('AB123456B')).toBe(true);
    expect(isValidNINO('AB123456')).toBe(true);
  });

  it('should return false for invalid NINO', () => {
    expect(isValidNINO('AB12345')).toBe(false);
    expect(isValidNINO('AB123456E')).toBe(false);
    expect(isValidNINO('QQ123456')).toBe(false);
    expect(isValidNINO('BG123456A')).toBe(false);
  });
});
