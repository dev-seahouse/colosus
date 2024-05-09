import { truncateRiskProfileDescriptionBeforeLineBreak } from './RiskProfilesTable.utils';

describe('RiskProfilesTable.utils', () => {
  it('should return the first line of the description before line break', () => {
    expect(
      truncateRiskProfileDescriptionBeforeLineBreak(
        'This is the first line.<br/>This is the second line.'
      )
    ).toEqual('This is the first line.');
  });
});
