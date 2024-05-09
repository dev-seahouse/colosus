import createGoAdvisorTheme from './createGoAdvisorTheme';

describe('createGoAdvisorTheme', () => {
  // snapshot test to warn changes
  it('should match snapshot', () => {
    expect(createGoAdvisorTheme()).toMatchSnapshot();
  });
});
