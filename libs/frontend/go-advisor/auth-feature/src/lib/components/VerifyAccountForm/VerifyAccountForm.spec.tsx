import { render, userEvent, screen } from '@bambu/react-test-utils';

import VerifyAccountForm from './VerifyAccountForm';

const fillVerificationCodeInput = async (verificationCode = '123456') => {
  const verificationCodeInput = screen.getByLabelText(
    'Enter code'
  ) as HTMLInputElement;

  await userEvent.type(verificationCodeInput, verificationCode);
};

const clickVerifyBtn = async () =>
  userEvent.click(screen.getByRole('button', { name: 'Verify' }));

describe('VerifyAccountForm', () => {
  beforeEach(() => {
    render(<VerifyAccountForm />);
  });

  it('should allow user to proceed if verification code entered is correct', async () => {
    await fillVerificationCodeInput();
    await clickVerifyBtn();

    // TODO: add expect
  });

  it('should display error message if verification code is not provided', async () => {
    await clickVerifyBtn();

    expect(screen.getByText(/Verification code required./i));
  });
});
