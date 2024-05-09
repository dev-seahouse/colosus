import { render, screen, userEvent } from '@bambu/react-test-utils';

import SettingsForm from './SettingsForm';

// TODO: Update test cases
const enterMinimumIncome = async (minimumIncome = 120000) => {
  const minimumIncomeInput = screen.getByLabelText(/minimum income/i);

  await userEvent.type(minimumIncomeInput, minimumIncome.toString());
};

const enterMinimumSaving = async (minimumSaving = 120000) => {
  const minimumSavingInput = screen.getByLabelText(/minimum saving/i);

  await userEvent.type(minimumSavingInput, minimumSavingInput.toString());
};

const submitSettingsForm = async () => {
  await userEvent.click(screen.getByRole('button', { name: /use this/i }));
};

describe.skip('SettingsForm', () => {
  beforeEach(() => {
    render(<SettingsForm />);
  });

  it('should display error if minimum income is not provided', async () => {
    await enterMinimumSaving();
    await submitSettingsForm();

    expect(screen.getByText(/minimum income is required/i));
  });

  it('should display error if minimum saving is not provided', async () => {
    await enterMinimumIncome();
    await submitSettingsForm();

    expect(screen.getByText(/minimum saving is required/i));
  });
});
