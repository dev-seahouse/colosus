import { render, screen, userEvent } from '@bambu/react-test-utils';

import RiskProfileTableDescriptionCell from './RiskProfileTableDescriptionCell';

describe('RiskProfileTableDescriptionCell', () => {
  beforeEach(() => {
    render(
      <RiskProfileTableDescriptionCell description="First line<br/>second line" />
    );
  });

  it('should render the first line of the description on mount', () => {
    expect(screen.getByText('First line').innerText).not.toContain(
      'second line'
    );
    expect(screen.getByRole('button', { name: /read more/i })).toBeDefined();
  });

  it('should render all lines when clicking read more button', async () => {
    const readMoreButton = screen.getByRole('button', { name: /read more/i });

    await userEvent.click(readMoreButton);

    expect(screen.getByText(/second line/i)).toBeDefined();
  });
});
