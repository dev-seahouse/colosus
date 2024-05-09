import {
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';
import {
  CalculateRetirementGoalAmountRequestGender,
  CalculateRetirementGoalAmountRequestPeriod,
} from '@bambu/api-client';
import useCalculateRetirementGoalAmount from './useCalculateRetirementGoalAmount';

const args = {
  age: 25,
  annualisedInflationRate: 1.25,
  annualisedSavingsAcctIntR: 0.5,
  annualRetirementIncome: 250000,
  country: 'US',
  gender: CalculateRetirementGoalAmountRequestGender.MALE,
  compoundsPerYear: 12,
  lifeExpectancyFemale: 81,
  lifeExpectancyMale: 80,
  retirementAge: 55,
  period: CalculateRetirementGoalAmountRequestPeriod.END,
};
const enabled = true;

describe('useCalculateRetirementGoalAmount', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(
      () =>
        useCalculateRetirementGoalAmount({
          enabled,
          args,
        }),
      {
        wrapper: queryClientWrapper,
      }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchSnapshot();
  });
});
