import { render, screen, userEvent } from '@bambu/react-test-utils';

import RetirementMonthlyExpensesForm from './RetirementMonthlyExpensesForm';
vi.mock('@harnessio/ff-react-client-sdk', async () => {
  const mod = await vi.importActual<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    typeof import('@harnessio/ff-react-client-sdk')
  >('@harnessio/ff-react-client-sdk');
  return {
    ...mod,
    useFeatureFlag: vi.fn().mockReturnValue(true),
  };
});

vi.mock(
  '../../hooks/useCalculateRetirementGoalAmount/useCalculateRetirementGoalAmount',
  async () => {
    const mod = await vi.importActual<
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      typeof import('../../hooks/useCalculateRetirementGoalAmount/useCalculateRetirementGoalAmount')
    >(
      '../../hooks/useCalculateRetirementGoalAmount/useCalculateRetirementGoalAmount'
    );

    return {
      ...mod,
      default: vi.fn().mockReturnValue({
        data: { goalAmount: 0 },
        isLoading: false,
      }),
    };
  }
);

describe('RetirementMonthlyExpensesForm', () => {
  it('should display error message if monthly expenses is not provided', async () => {
    render(<RetirementMonthlyExpensesForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(
      screen.getByText('Your monthly expenses must be $1 or higher')
    ).toBeDefined();
  });
});
