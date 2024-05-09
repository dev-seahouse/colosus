import PaymentSettingsGoalCard from './PaymentSettingsGoalCard';
import { ReactHookFormWrapper, render } from '@bambu/react-test-utils';
import { GoalTypeEnum } from '@bambu/go-core';

describe('PaymentSettingsGoalCard', () => {
  beforeAll(() => {
    vi.mock('./useSelectPaymentSettingsState', () => ({
      default: () => ({
        goalType: GoalTypeEnum.Other,
        goalName: 'My Dream goal',
        goalValue: 100000,
        goalTimeframe: 4,
        initialDeposit: 400,
        recurringDeposit: 400,
      }),
    }));
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <ReactHookFormWrapper>
        <PaymentSettingsGoalCard />
      </ReactHookFormWrapper>
    );
    expect(baseElement).toBeTruthy();
  });
});
