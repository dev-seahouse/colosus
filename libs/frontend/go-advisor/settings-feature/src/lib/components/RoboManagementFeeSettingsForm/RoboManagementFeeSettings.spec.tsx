import { render, screen, userEvent } from '@bambu/react-test-utils';
import RoboManagementFeeSettings from './RoboManagementFeeSettings';

const clearAccountNameInput = async () => {
  const accountNameInput = screen.getByLabelText(
    'Account name'
  ) as HTMLInputElement;

  await userEvent.clear(accountNameInput);
};

const submitSettingsForm = async () => {
  await userEvent.click(
    screen.getByRole('button', { name: /use this configuration/i })
  );
};

describe('UpdatePlatformSetupForm', () => {
  beforeEach(() => {
    render(<RoboManagementFeeSettings />);
  });

  describe.skip('Robo management fee settings', () => {
    it('should display error message if account name is not provided', async () => {
      await clearAccountNameInput();
      await submitSettingsForm();

      expect(screen.findByText(/Account name is required/i));
    });
  });
});
