import generateGoalYearOptions from './generateGoalYearOptions';

describe('generateGoalYearOptions', () => {
  it('should return an array of years', () => {
    const years = generateGoalYearOptions(25);

    expect(years).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: expect.any(String),
          value: expect.any(Number),
        }),
      ])
    );
  });
});
