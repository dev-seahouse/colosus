import { render, screen, userEvent } from '@bambu/react-test-utils';

import AnnualIncomeForm from './AnnualIncomeForm';

const enterTextField = async (labelText: string, value: string) => {
  const input = await screen.findByLabelText(labelText);

  await userEvent.type(input, value);
};

const enterAnnualIncome = async (annualIncome = 120000) => {
  await enterTextField('Annual income', annualIncome.toString());
};

const enterMonthlySavings = async (monthlySavings = 1000) => {
  await enterTextField('Monthly savings', monthlySavings.toString());
};

const submitAnnualIncomeForm = async () => {
  const submitButton = await screen.findByRole('button', {
    name: 'Next',
  });

  await userEvent.click(submitButton);
};

describe('AnnualIncomeForm', () => {
  beforeEach(() => {
    render(<AnnualIncomeForm />);
  });

  it('should display error message when annualIncome is invalid', async () => {
    await enterAnnualIncome(0);
    await submitAnnualIncomeForm();

    expect(
      await screen.findByText('Annual income must be $1 or higher')
    ).toBeDefined();
  });

  it('should not display error message when annualIncome is valid', async () => {
    await enterAnnualIncome();
    await submitAnnualIncomeForm();

    expect(
      await screen.queryByText('Annual income must be $1 or higher')
    ).toBeNull();
  });

  it('should display error message when monthlySavings is invalid', async () => {
    await enterMonthlySavings(0);
    await submitAnnualIncomeForm();

    expect(
      screen.getByText('Monthly savings must be $1 or higher')
    ).toBeDefined();
  });

  it('should not display error message when monthlySavings is valid', async () => {
    await enterMonthlySavings();
    await submitAnnualIncomeForm();

    expect(
      await screen.queryByText('Monthly savings must be $1 or higher')
    ).toBeNull();
  });
});
