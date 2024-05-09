import { render, screen, userEvent } from '@bambu/react-test-utils';
import ResetPasswordUpdateForm from './ResetPasswordUpdateForm';
import * as useResetPasswordForm from '../../hooks/useResetPassword/useResetPassword';

const VALID_PASSWORD = 'Bambu@2023'; // 10 chars:upper,lower,number,special
const VALID_PASSWORD_2 = 'Baambu@2023';
const LESS_THAN_MIN_LENGTH_PASSWORD = 'Bambu@01';
const NO_SPECIAL_CHARACTERS_PASSWORD = 'Bambu19888';
const NO_NUMBER_PASSWORD = 'BambuBambuBambu';
const NO_CAP_PASSWORD = 'bambu@123456';
const NO_LOWER_PASSWORD = 'BAMBU@123456';

describe(
  'ResetPasswordUpdateForm',
  () => {
    it('should render successfully', () => {
      const { baseElement } = render(<ResetPasswordUpdateForm />);
      expect(baseElement).toBeTruthy();
    });

    it('should allow user to send update password request if inputs are valid', async () => {
      const mockMutate = vi.fn();
      vi.spyOn(useResetPasswordForm, 'useResetPassword').mockReturnValue({
        mutate: mockMutate,
      });
      render(<ResetPasswordUpdateForm />);
      await fillPasswordField(VALID_PASSWORD);
      await fillRepeatPasswordField(VALID_PASSWORD);
      await clickOnUpdatePasswordButton();
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });

    it('should display error message if password is empty', async () => {
      render(<ResetPasswordUpdateForm />);
      const PASSWORD_REQUIRED_MESSAGE = /Password does not meet requirements/i;
      await clickOnUpdatePasswordButton();
      expect(screen.getByText(PASSWORD_REQUIRED_MESSAGE)).toBeVisible();
    });

    it('should not submit form if password have less than 10 characters', async () => {
      await testPasswordStrength(LESS_THAN_MIN_LENGTH_PASSWORD);
    });

    it('should not submit form if password have no characters', async () => {
      await testPasswordStrength(NO_SPECIAL_CHARACTERS_PASSWORD);
    });

    it('should not submit form if password have no number', async () => {
      await testPasswordStrength(NO_NUMBER_PASSWORD);
    });

    it('should not submit form if password have no capital letter', async () => {
      await testPasswordStrength(NO_CAP_PASSWORD);
    });

    it('should not submit form if password have no lowercase letter', async () => {
      await testPasswordStrength(NO_LOWER_PASSWORD);
    });

    it('should display error message if repeat-password does not match', async () => {
      render(<ResetPasswordUpdateForm />);
      const PASSWORD_NOT_MATCHED_ERROR_MESSAGE =
        /Repeat password must match your selected password/i;
      await fillPasswordField(VALID_PASSWORD);
      await fillRepeatPasswordField(VALID_PASSWORD_2);
      await clickOnUpdatePasswordButton();
      expect(
        screen.getByText(PASSWORD_NOT_MATCHED_ERROR_MESSAGE)
      ).toBeVisible();
    });
  },
  {
    timeout: 10000,
  }
);

async function fillPasswordField(text: string) {
  await _fillPasswordField(/^new password$/i, text);
}

async function fillRepeatPasswordField(text: string) {
  await _fillPasswordField(/^repeat new password$/i, text);
}

async function clickOnUpdatePasswordButton() {
  await _clickOnButton(/update password/i);
}

async function _fillPasswordField(name: string | RegExp, value: string) {
  // getByRole is recommended in general, except for password field which don't have implicit role
  const input = screen.getByLabelText(name);
  await userEvent.type(input, value);
}

async function _clickOnButton(name: string | RegExp) {
  const button = screen.getByRole('button', {
    name: name,
  });
  await userEvent.click(button);
}

async function testPasswordStrength(password: string) {
  const mockMutate = vi.fn();
  vi.spyOn(useResetPasswordForm, 'useResetPassword').mockReturnValue({
    mutate: mockMutate,
  });
  render(<ResetPasswordUpdateForm />);
  await fillPasswordField(NO_CAP_PASSWORD);
  await fillRepeatPasswordField(NO_CAP_PASSWORD);
  await clickOnUpdatePasswordButton();
  expect(mockMutate).not.toHaveBeenCalled();
}
