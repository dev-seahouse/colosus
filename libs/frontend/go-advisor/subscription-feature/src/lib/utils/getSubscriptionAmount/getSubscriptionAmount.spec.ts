import getSubscriptionAmount from './getSubscriptionAmount';

describe('getSubscriptionAmount', () => {
  it('should return 0 if amount is null', () => {
    expect(getSubscriptionAmount(null)).toEqual(0);
  });

  it('should return amount in dollars', () => {
    expect(getSubscriptionAmount(100)).toEqual(1);
  });
});
