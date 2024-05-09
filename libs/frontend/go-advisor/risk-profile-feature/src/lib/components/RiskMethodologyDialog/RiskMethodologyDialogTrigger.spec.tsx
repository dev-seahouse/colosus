import { render, userEvent, screen } from '@bambu/react-test-utils';

import RiskMethodologyDialogTrigger from './RiskMethodologyDialogTrigger';

describe('RiskMethodologyDialogTrigger', () => {
  it('should be able to open risk methodology dialog', async () => {
    render(<RiskMethodologyDialogTrigger />);

    await userEvent.click(screen.getByRole('button', { name: /click here/i }));

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
