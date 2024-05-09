import {
  act,
  renderHook,
  queryClientWrapper,
  waitFor,
} from '@bambu/react-test-utils';

import useSaveLead from './useSaveLead';

describe('useSaveLead', () => {
  it('should call onSuccess when operation is successful', async () => {
    const { result } = renderHook(() => useSaveLead({}), {
      wrapper: queryClientWrapper,
    });

    act(() =>
      result.current.mutate({
        name: 'string',
        email: 'string',
        phoneNumber: 'string',
        zipCode: 'string',
        age: 0,
        incomePerAnnum: 0,
        currentSavings: 0,
        isRetired: true,
        goalDescription: 'Retire comfortably',
        goalName: 'Retirement',
        goalValue: 0,
        goalTimeframe: 0,
        riskAppetite: 'd287ada9-5025-41f3-a6de-4ce529afee6b',
        notes: 'foo bar',
        initialInvestment: 100,
        sendGoalProjectionEmail: true,
        monthlyContribution: 100,
        projectedReturns: {
          target: 100,
          high: 200,
          low: 50,
        },
        sendAppointmentEmail: false,
        monthlySavings: null,
      })
    );

    await waitFor(() => result.current.isSuccess);
  });
});
