import { render, screen, userEvent } from '@bambu/react-test-utils';

import QualifiedLeadsDialog from './QualifiedLeadsDialog';

describe('QualifiedLeadsDialog', () => {
  it('should be able to open dialog', async () => {
    render(<QualifiedLeadsDialog />);

    const openDialogButton = screen.getByRole('button', {
      name: /open qualified leads dialog/i,
    });

    await userEvent.click(openDialogButton);

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
