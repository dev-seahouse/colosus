import { render, screen, userEvent } from '@bambu/react-test-utils';

import ShareRoboButton from './ShareRoboButton';

vi.mock('@bambu/go-advisor-core', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<typeof import('@bambu/go-advisor-core')>(
    '@bambu/go-advisor-core'
  );
  return {
    ...mod,
    useSelectUnfinishedTaskIndexQuery: vi.fn().mockReturnValueOnce(-1),
  };
});

const clickShareRoboButton = async () => {
  const shareRoboButton = await screen.findByRole('button', {
    name: /share my robo/i,
  });

  await userEvent.click(shareRoboButton);
};

describe('ShareRoboButton', () => {
  beforeEach(() => {
    render(<ShareRoboButton />);
  });

  it('should be able to open dialog if user has active subscription and active profile', async () => {
    await clickShareRoboButton();

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
