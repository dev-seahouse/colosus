// @vitest-environment jsdom
import { render, userEvent, screen } from '@bambu/react-test-utils';

import CreateAccountForm from './CreateAccountForm';

const fillEmailInput = async (email = 'email@bambu.co') => {
  await userEvent.type(screen.getByTestId('business-email-input'), email);
};

const fillPasswordInput = async (password = 'Bambu@123') => {
  await userEvent.type(screen.getByTestId('password-input'), password);
};

const fillRepeatPasswordInput = async (password = 'Bambu@123') => {
  await userEvent.type(screen.getByTestId('repeat-password-input'), password);
};

const clickCheckboxBtn = async () => {
  await userEvent.click(screen.getByTestId('is-agreed-chkbox'));
};

const clickCreateBtn = async () =>
  await userEvent.click(screen.getByTestId('create-account-btn'));

describe('CreateAccountForm', () => {
  beforeEach(() => {
    render(<CreateAccountForm />);
  });

  it('should allow user to proceed if all input is valid', async () => {
    await fillEmailInput();
    await fillPasswordInput();
    await fillRepeatPasswordInput();
    await clickCheckboxBtn();
    await clickCreateBtn();

    // TODO: add expect
  });

  it('should display error message if email is not provided', async () => {
    await fillPasswordInput();
    await fillRepeatPasswordInput();
    await clickCheckboxBtn();
    await clickCreateBtn();

    expect(
      screen.getByText(/Please provide a valid email address/i)
    ).toBeInTheDocument();
  });

  it('should display error message if email is not valid', async () => {
    await fillEmailInput('invalid-email-here');
    await fillPasswordInput();
    await fillRepeatPasswordInput();
    await clickCheckboxBtn();
    await clickCreateBtn();

    expect(
      screen.getByText(/Please provide a valid email address/i)
    ).toBeInTheDocument();
  });

  it('should display error message if password does not have 10 characters', async () => {
    await fillEmailInput();
    await fillPasswordInput('1234');
    await fillRepeatPasswordInput();
    await clickCheckboxBtn();
    await clickCreateBtn();

    expect(screen.getByText(/At least 10 characters/i)).toBeInTheDocument();
  });

  it('should display error message if password does not have special characters', async () => {
    await fillEmailInput();
    await fillPasswordInput('1234');
    await fillRepeatPasswordInput();
    await clickCheckboxBtn();
    await clickCreateBtn();

    expect(
      screen.getByText(/At least 1 special character/i)
    ).toBeInTheDocument();
  });

  it('should display error message if passwords do not match', async () => {
    await fillEmailInput();
    await fillPasswordInput();
    await fillRepeatPasswordInput('1234');
    await clickCheckboxBtn();
    await clickCreateBtn();

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('should display error message if tnc is not acknowledged', async () => {
    await fillEmailInput();
    await fillPasswordInput();
    await fillRepeatPasswordInput();
    await clickCheckboxBtn();
    await clickCheckboxBtn();
    await clickCreateBtn();

    expect(screen.getByText(/Please acknowledge/i)).toBeInTheDocument();
  });

  /**
   * there is an issue with this or the mock server
   * TODO: figure it out later
   */
  it.skip('should display error message if account with the same email address exists', async () => {
    await fillEmailInput('exists@bambu.co');
    await fillPasswordInput();
    await fillRepeatPasswordInput();
    await clickCheckboxBtn();
    await clickCreateBtn();

    expect(
      await screen.findByText(
        /This email address is already associated with an existing account/i
      )
    ).toBeInTheDocument();
  });
});
