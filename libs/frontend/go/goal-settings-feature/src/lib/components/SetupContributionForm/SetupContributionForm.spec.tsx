import { render, screen, userEvent } from '@bambu/react-test-utils';
import SetupContributionForm from './SetupContributionForm';

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

const submitContributionForm = async () => {
  const submitButton = screen.getByRole('button', { name: /next/i });
  await userEvent.click(submitButton);
};

const enterInitialDeposit = async (initialDeposit: number | string = 10000) => {
  const initialDepositInput = screen.getByLabelText(/Initial Deposit/i);
  await userEvent.type(initialDepositInput, initialDeposit.toString());
};

const enterRecurringDeposit = async (
  recurringDeposit: number | string = 1000
) => {
  const recurringDepositInput = screen.getByLabelText(
    /Monthly Recurring Deposit/i
  );
  await userEvent.type(recurringDepositInput, recurringDeposit.toString());
};

describe('SetupContributionForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SetupContributionForm />);
    expect(baseElement).toBeTruthy();
  });

  it('should display error message when initial deposit is invalid', async () => {
    render(<SetupContributionForm />);
    await enterInitialDeposit(0);
    await enterRecurringDeposit(1000);
    await submitContributionForm();
    // expect Your min deposit is {any value} or higher
    expect(
      screen.getByText(/Your min deposit is \$\d+ or higher/i)
    ).toBeTruthy();
  });

  it('should display error message when recurring deposit is invalid', async () => {
    render(<SetupContributionForm />);
    await enterInitialDeposit(1000);
    await enterRecurringDeposit(24);
    await submitContributionForm();
    expect(
      screen.getByText(/Your min monthly recurring deposit is \$\d+ or higher/i)
    ).toBeTruthy();
  });

  it('should not display error message when recurring deposit is 0', async () => {
    render(<SetupContributionForm />);
    await enterInitialDeposit(1000);
    await enterRecurringDeposit(0);
    await submitContributionForm();
    expect(
      screen.queryByText(
        /Your min monthly recurring deposit is \$\d+ or higher/i
      )
    ).toBeFalsy();
  });

  it('should allow to submit when inputs are valid', async () => {
    render(<SetupContributionForm />);
    await enterInitialDeposit(1000);
    await enterRecurringDeposit(1000);
    await submitContributionForm();

    expect(
      screen.queryByText(/Your min deposit is \$\d+ or higher/i)
    ).toBeFalsy();

    expect(
      screen.queryByText(
        /Your min monthly recurring deposit is \$\d+ or higher/i
      )
    ).toBeFalsy();
  });

  it('should display recommendation', async () => {
    render(<SetupContributionForm />);
    expect(
      await screen.findByTestId('setup-contribution-recommendation')
    ).toBeTruthy();
  });
});
