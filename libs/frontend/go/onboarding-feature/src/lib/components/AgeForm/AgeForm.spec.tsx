import { render, screen, userEvent } from '@bambu/react-test-utils';

import AgeForm from './AgeForm';

const enterAge = async (age = 21) => {
  const ageInput = await screen.findByLabelText('Age');

  await userEvent.type(ageInput, age.toString());
};

const submitAgeForm = async () => {
  const submitButton = await screen.findByRole('button', {
    name: 'Next',
  });

  await userEvent.click(submitButton);
};

describe('AgeForm', () => {
  beforeEach(() => {
    render(<AgeForm />);
  });

  it('should display error if age is below 18 years old', async () => {
    await enterAge(17);
    await submitAgeForm();

    expect(screen.getByText('Age must be between 18 and 80')).toBeDefined();
  });

  it('should display error if age is above 80 years old', async () => {
    await enterAge(81);
    await submitAgeForm();

    expect(screen.getByText('Age must be between 18 and 80')).toBeDefined();
  });

  it('should not display error if age is between 18 and 80', async () => {
    await enterAge();
    await submitAgeForm();

    expect(
      await screen.queryByText('Age must be between 18 and 80')
    ).toBeNull();
  });
});
