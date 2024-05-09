import createBambuTheme from './createBambuTheme';

describe('createBambuTheme', () => {
  it('should generate a bambu theme by default', () => {
    // just snapshot check to quick check the changes if any
    expect(createBambuTheme()).toMatchSnapshot();
  });
});
