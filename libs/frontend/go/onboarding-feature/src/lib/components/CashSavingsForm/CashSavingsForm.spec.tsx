import { render, screen, userEvent } from '@bambu/react-test-utils';

import CashSavingsForm from './CashSavingsForm';

const enterCashSavings = async (cashSavings = 120000) => {
  const cashSavingsInput = screen.getByLabelText('Cash savings');

  await userEvent.type(cashSavingsInput, cashSavings.toString());
};

const submitCashSavingsForm = async () => {
  const submitButton = screen.getByRole('button', {
    name: 'Next',
  });

  await userEvent.click(submitButton);
};

describe('CashSavingsForm', () => {
  beforeEach(() => {
    render(<CashSavingsForm />);
  });

  it('should display error message when cashSavings is invalid', async () => {
    await enterCashSavings(0);
    await submitCashSavingsForm();

    expect(screen.getByText('Cash savings must be $1 or higher')).toBeDefined();
  });

  it('should not display error message when cashSavings is valid', async () => {
    await enterCashSavings();
    await submitCashSavingsForm();

    expect(
      await screen.queryByText('Cash savings must be $1 or higher')
    ).toBeNull();
  });
});
