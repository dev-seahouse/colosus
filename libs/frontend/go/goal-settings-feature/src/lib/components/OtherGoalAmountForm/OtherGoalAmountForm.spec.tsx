import { render, userEvent, screen } from '@bambu/react-test-utils';

import OtherGoalAmountForm from './OtherGoalAmountForm';

const enterGoalAmount = async (goalAmount = 10000) => {
  const goalAmountInput = screen.getByLabelText('Target Amount');

  await userEvent.type(goalAmountInput, goalAmount.toString());
};

const submitGoalAmountForm = async () => {
  const submitButton = screen.getByRole('button', {
    name: 'Next',
  });

  await userEvent.click(submitButton);
};

describe('OtherGoalAmountForm', () => {
  beforeEach(() => {
    render(<OtherGoalAmountForm />);
  });

  it('should display error message when goalAmount is invalid', async () => {
    await enterGoalAmount(0);
    await submitGoalAmountForm();

    expect(
      screen.getByText('Your target amount must be $1 or higher')
    ).toBeDefined();
  });

  it('should not display error message when goalAmount is valid', async () => {
    await enterGoalAmount();
    await submitGoalAmountForm();

    expect(
      await screen.queryByText('Your target amount must be $1 or higher')
    ).toBeNull();
  });
});
