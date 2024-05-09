import { render, userEvent, screen } from '@bambu/react-test-utils';

import LoginForm from './LoginForm';

const fillEmailInput = async (email = 'email@bambu.co') => {
  const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;

  await userEvent.type(emailInput, email);
};

const fillPasswordInput = async (password = 'Bambu@123') => {
  const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

  await userEvent.type(passwordInput, password);
};

const clickLoginBtn = async () =>
  userEvent.click(screen.getByRole('button', { name: 'Log in' }));

describe('LoginForm', () => {
  beforeEach(() => {
    render(<LoginForm />);
  });

  it('should display error message if email is not provided', async () => {
    await fillPasswordInput();
    await clickLoginBtn();

    expect(
      screen.getByText(/Please enter a valid email address./i)
    ).toBeDefined();
  });

  it('should display error message if email is not valid', async () => {
    await fillEmailInput('invalid-email-here');
    await fillPasswordInput();
    await clickLoginBtn();

    expect(
      screen.getByText(/Please enter a valid email address./i)
    ).toBeDefined();
  });

  it('should display error message if password is not provided', async () => {
    await fillEmailInput();
    await clickLoginBtn();

    expect(screen.getByText(/a password is required/i)).toBeDefined();
  });

  it('should display credentials error message if credentials provided is invalid', async () => {
    await fillEmailInput('invalid@bambu.co');
    await fillPasswordInput();
    await clickLoginBtn();

    expect(screen.getByTestId('credentials-error-message')).toBeDefined();
  });

  it('should display unverified error message if the account is unverified', async () => {
    await fillEmailInput('unverified@bambu.co');
    await fillPasswordInput();
    await clickLoginBtn();

    expect(
      screen.getByTestId('unverified-account-error-message')
    ).toBeDefined();
  });
});
