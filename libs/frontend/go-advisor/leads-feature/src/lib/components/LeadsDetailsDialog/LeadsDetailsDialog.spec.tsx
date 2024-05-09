import { render, screen, userEvent } from '@bambu/react-test-utils';

import LeadsDetailsDialog from './LeadsDetailsDialog';

describe('LeadsDetailsDialog', () => {
  it('should be able to open dialog', async () => {
    render(<LeadsDetailsDialog title="title" description="description" />);

    const openDialogButton = screen.getByRole('button', {
      name: /open title dialog/i,
    });

    await userEvent.click(openDialogButton);

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
