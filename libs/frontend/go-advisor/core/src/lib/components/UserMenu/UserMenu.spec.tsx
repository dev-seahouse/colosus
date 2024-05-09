import { render, screen, userEvent } from '@bambu/react-test-utils';

import UserMenu from './UserMenu';

const openMenu = async () => {
  const userMenuButton = await screen.getByRole('button', {
    name: /user's account menu/i,
  });

  await userEvent.click(userMenuButton);
};

describe('UserMenu', () => {
  it('should allow user to open menu', async () => {
    render(<UserMenu />);
    await openMenu();

    expect(screen.getByRole('presentation')).toBeDefined();
  });
});
