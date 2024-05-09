import { render, userEvent, screen } from '@bambu/react-test-utils';

import OtherGoalNameForm from './OtherGoalNameForm';

const enterGoalName = async (goalName = 'Saving') => {
  const goalNameInput = screen.getByLabelText('Goal name');

  await userEvent.type(goalNameInput, goalName);
};

const submitGoalNameForm = async () => {
  const submitButton = screen.getByRole('button', {
    name: 'Next',
  });

  await userEvent.click(submitButton);
};

describe('OtherGoalNameForm', () => {
  beforeEach(() => {
    render(<OtherGoalNameForm />);
  });

  it('should display error message when goalName is invalid', async () => {
    await submitGoalNameForm();

    expect(screen.getByText('Your goal name is required')).toBeDefined();
  });

  it('should not display error message when goalName is valid', async () => {
    await enterGoalName();
    await submitGoalNameForm();

    expect(await screen.queryByText('Your goal name is required')).toBeNull();
  });
});
