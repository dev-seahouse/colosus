import { render, userEvent, screen } from '@bambu/react-test-utils';

import GrowMyWealthForm from './GrowMyWealthForm';

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

const enterInvestmentAmount = async (investmentAmount = 10000) => {
  const investmentAmountInput = screen.getByLabelText('Investment Amount');

  await userEvent.type(investmentAmountInput, investmentAmount.toString());
};

const submitInvestmentAmountForm = async () => {
  const submitButton = screen.getByRole('button', {
    name: 'Next',
  });

  await userEvent.click(submitButton);
};

describe('GrowMyWealthForm', () => {
  beforeEach(() => {
    render(<GrowMyWealthForm />);
  });

  it('should display error message when investmentAmount is invalid', async () => {
    await enterInvestmentAmount(0);
    await submitInvestmentAmountForm();

    expect(
      screen.getByText('Investment amount must be $1 or higher')
    ).toBeDefined();
  });

  it('should not display error message when investmentAmount is valid', async () => {
    await enterInvestmentAmount();
    await submitInvestmentAmountForm();

    expect(
      await screen.queryByText('Investment amount must be $1 or higher')
    ).toBeNull();
  });
});
