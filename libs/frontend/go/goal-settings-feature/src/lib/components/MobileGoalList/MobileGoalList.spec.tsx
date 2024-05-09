import { render, screen, userEvent } from '@bambu/react-test-utils';

import MobileGoalList from './MobileGoalList';

const mockNavigate = vi.fn();

vi.mock('../../hooks/useSelectGoal/useSelectGoal', () => ({
  default: () => mockNavigate,
}));

describe('DesktopGoalList', () => {
  beforeEach(() => {
    render(<MobileGoalList />);
  });

  it('should navigate to the next page if a goal is selected', async () => {
    const goalCard = await screen.findByRole('button', {
      name: /select retirement/i,
    });

    await userEvent.click(goalCard);

    expect(mockNavigate).toHaveBeenCalled();
  });
});
