import createMobilePreviewTheme from './createMobilePreviewTheme';

describe('createMobilePreviewTheme', () => {
  it('should create a theme for mobile preview', () => {
    expect(createMobilePreviewTheme()).toMatchSnapshot();
  });
});
