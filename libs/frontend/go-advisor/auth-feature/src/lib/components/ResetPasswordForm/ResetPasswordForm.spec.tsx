import { render, userEvent, screen } from '@bambu/react-test-utils';
import ResetPasswordForm from './ResetPasswordForm';

const fillEmailInput = async (email: string) => {
  const emailInput = screen.getByRole('textbox', {
    name: /email address/i,
  });
  await userEvent.type(emailInput, email);
};

const clickOnSendRequest = async () =>
  userEvent.click(screen.getByRole('button', { name: /Send Request/i }));

describe('ResetPasswordForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResetPasswordForm />);
    expect(baseElement).toBeTruthy();
  });

  it('should allow user to send reset password request if input is valid', async () => {
    render(<ResetPasswordForm />);
    await fillEmailInput('test@bambu.co');
    await clickOnSendRequest();
  });

  it('should display error message if email is empty', async () => {
    render(<ResetPasswordForm />);
    const EMAIL_REQUIRED_MESSAGE = /an email address is required/i;
    await clickOnSendRequest();
    expect(screen.getByText(EMAIL_REQUIRED_MESSAGE)).not.toBeNull();
  });

  it('should display error message if email is invalid format', async () => {
    render(<ResetPasswordForm />);
    const EMAIL_INVALID_FORMAT_MESSAGE = /please enter a valid email address/i;
    await fillEmailInput('test');
    await clickOnSendRequest();
    expect(screen.getByText(EMAIL_INVALID_FORMAT_MESSAGE)).not.toBeNull();
  });
});
