import { render, screen, userEvent } from '@bambu/react-test-utils';

import InAppPreview from './InAppPreview';

describe('InAppPreview', () => {
  beforeEach(() => {
    render(<InAppPreview />);
  });

  it('should display iframe in mobile view on mount', () => {
    expect(screen.getByLabelText('app mobile preview')).toBeDefined();
  });

  it('should be able to switch to desktop view', async () => {
    await userEvent.click(
      screen.getByRole('button', {
        name: /click to preview app in desktop mode/i,
      })
    );

    expect(screen.getByLabelText('app desktop preview')).toBeDefined();
  });
});
