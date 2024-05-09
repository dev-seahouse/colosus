import { render, screen, userEvent } from '@bambu/react-test-utils';
import { QueryClient } from '@tanstack/react-query';
import { getSubdomainQuery } from '@bambu/go-advisor-core';
import UpdatePlatformSetupForm from './UpdatePlatformSetupForm';

const clearTradeNameInput = async () => {
  const tradeNameInput = screen.getByLabelText(
    'Robo-advisor name'
  ) as HTMLInputElement;

  await userEvent.clear(tradeNameInput);
};

const getSubdomainInput = () =>
  screen.getByLabelText('Robo-advisor link') as HTMLInputElement;

const fillSubdomainInput = async (subdomain = 'bambu') => {
  const subdomainInput = getSubdomainInput();

  await userEvent.type(subdomainInput, subdomain);
};

const fillTradeNameInput = async (tradeName = 'Bambu') => {
  const tradeNameInput = screen.getByLabelText(
    'Robo-advisor name'
  ) as HTMLInputElement;

  await userEvent.type(tradeNameInput, tradeName);
};

const submitPlatformSetupForm = async () => {
  await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
};

const queryClient = new QueryClient();

queryClient.setQueryData(getSubdomainQuery().queryKey, () => ({
  tradeName: 'Wealth Avenue',
  subdomain: 'wealth-avenue',
}));

describe('UpdatePlatformSetupForm', () => {
  beforeEach(() => {
    render(<UpdatePlatformSetupForm />);
  });

  describe('Trade name', () => {
    it('should display error message if trade name is not provided', async () => {
      await clearTradeNameInput();
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
    it('should not allow the user to change subdomain', async () => {
      const subdomainInput = getSubdomainInput();
      await fillSubdomainInput();

      expect(subdomainInput.value).not.toEqual('bambu');
    });
  });
});
