import { render, screen, userEvent } from '@bambu/react-test-utils';

import PlatformSetupForm from './PlatformSetupForm';

const fillTradeNameInput = async (tradeName = 'Bambu') => {
  const tradeNameInput = screen.getByLabelText(
    'Robo-advisor name'
  ) as HTMLInputElement;

  await userEvent.type(tradeNameInput, tradeName);
};

const fillSubdomainInput = async (subdomain = 'bambu') => {
  const subdomainInput = screen.getByLabelText(
    'Robo-advisor link'
  ) as HTMLInputElement;

  await userEvent.type(subdomainInput, subdomain);
};

const submitPlatformSetupForm = async () => {
  await userEvent.click(screen.getByRole('button', { name: /set up/i }));
};

describe('PlatformSetupForm', () => {
  beforeEach(() => {
    render(<PlatformSetupForm />);
  });

  describe('Trade name', () => {
    it('should display error message if trade name is not provided', async () => {
      await fillSubdomainInput();
      await submitPlatformSetupForm();

      expect(screen.getByText(/The name of your brand is required/i));
    });

    it('should display error message if trade name is > 20 chars', async () => {
      await fillTradeNameInput(
        'this is an extremely long trade name for a robo application, trust me'
      );
      await fillSubdomainInput();
      await submitPlatformSetupForm();

      expect(screen.getByText(/Your robo-advisor name exceeds 20 characters/i));
    });
  });

  describe('Subdomain', () => {
    it('should display error message if subdomain is not provided', async () => {
      await fillTradeNameInput();
      await submitPlatformSetupForm();

      expect(screen.getByText(/Your robo-advisor link is required/i));
    });

    it('should display error message if subdomain contains invalid character', async () => {
      await fillTradeNameInput();
      await fillSubdomainInput('bambu@rocks');
      await submitPlatformSetupForm();

      expect(
        screen.getByText(
          /Your link must include only lowercase letters, numbers and dashes/i
        )
      );
    });

    it('should display error message if subdomain does not contain a single letter', async () => {
      await fillTradeNameInput();
      await fillSubdomainInput('12345');
      await submitPlatformSetupForm();

      expect(screen.getByText(/Your link must include at least one letter/i));
    });

    it('should display error message if subdomain starts with a dash', async () => {
      await fillTradeNameInput();
      await fillSubdomainInput('-abcd1');
      await submitPlatformSetupForm();

      expect(screen.getByText(/Your link must not start or end with a dash/i));
    });

    it('should display error message if subdomain ends with a dash', async () => {
      await fillTradeNameInput();
      await fillSubdomainInput('abcd1-');
      await submitPlatformSetupForm();

      expect(screen.getByText(/Your link must not start or end with a dash/i));
    });
  });
});
