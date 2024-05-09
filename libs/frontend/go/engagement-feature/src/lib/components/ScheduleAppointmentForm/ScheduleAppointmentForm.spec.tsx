import { render, userEvent, screen } from '@bambu/react-test-utils';

import ScheduleAppointmentForm from './ScheduleAppointmentForm';

const fillEmailInput = async (email = 'email@bambu.co') => {
  const emailInput = screen.getByLabelText('Email') as HTMLInputElement;

  await userEvent.type(emailInput, email);
};

const fillNameInput = async (name = 'Matius') => {
  const nameInput = screen.getByLabelText('Name') as HTMLInputElement;

  await userEvent.type(nameInput, name);
};

const agreeToTerms = async () => {
  const checkbox = screen.getByRole('checkbox', {
    name: /^I agree to .* Terms of Service and Privacy Policy$/i,
  });

  await userEvent.click(checkbox);
};

const submitForm = async () =>
  userEvent.click(screen.getByRole('button', { name: /submit/i }));

describe(
  'ScheduleAppointmentForm',
  () => {
    beforeAll(() => {
      vi.mock('@bambu/go-core', async () => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-imports
        const mod = await vi.importActual<typeof import('@bambu/go-core')>(
          '@bambu/go-core'
        );
        return {
          ...mod,
          useSelectRiskProfileId: vi
            .fn()
            .mockReturnValue('38ae4560-7dcc-487a-88d6-4bd983d6da00'),
        };
      });
    });

    afterAll(() => {
      vi.resetAllMocks();
      vi.clearAllMocks();
    });
    beforeEach(() => {
      render(<ScheduleAppointmentForm />);
    });

    it('should display error message if email is not provided', async () => {
      await fillNameInput();
      await agreeToTerms();
      await submitForm();

      expect(screen.getByText(/Your email address is required/i));
    });

    it('should display error message if email is not valid', async () => {
      await fillEmailInput('invalid-email-here');
      await fillNameInput();
      await agreeToTerms();
      await submitForm();

      expect(screen.getByText(/Please enter a valid email/i));
    });

    it('should display error message if name is not provided', async () => {
      await fillEmailInput();
      await agreeToTerms();
      await submitForm();

      expect(screen.getByText(/Your name is required/i));
    });

    it('should display error message if t&c agreement is not checked', async () => {
      await fillEmailInput();
      await fillNameInput();
      await submitForm();

      expect(screen.getByText(/Please acknowledge the above agreement/i));
    });
  },
  {
    timeout: 10000,
  }
);
