import { render, screen, userEvent } from '@bambu/react-test-utils';

import VideoPlayer from './VideoPlayer';

describe('VideoPlayer', () => {
  it('should be able to open dialog to play video', async () => {
    render(<VideoPlayer type="Branding" />);

    await userEvent.click(
      screen.getByRole('button', { name: /play branding video/i })
    );

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
