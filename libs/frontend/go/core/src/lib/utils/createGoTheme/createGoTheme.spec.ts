import createGoTheme, { DEFAULT_BRANDING } from './createGoTheme';

describe('createGoTheme', () => {
  it('should create GO theme', () => {
    expect(createGoTheme(DEFAULT_BRANDING, {})).toMatchSnapshot();
  });
});
