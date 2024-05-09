import { render, screen, userEvent } from '@bambu/react-test-utils';

import DesktopGoalList from './DesktopGoalList';

const clickNext = async () => {
  const nextButton = screen.getByRole('button', { name: /next/i });

  await userEvent.click(nextButton);
};

const mockNavigate = vi.fn();

vi.mock('../../hooks/useSelectGoal/useSelectGoal', () => ({
  default: () => mockNavigate,
}));

describe.skip('DesktopGoalList', () => {
  beforeEach(() => {
    render(<DesktopGoalList />);
  });

  it('should not navigate to the next page if a goal is not selected', async () => {
    await clickNext();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should navigate to the next page if a goal is selected', async () => {
    const goalCard = await screen.findByRole('button', {
      name: /select retirement/i,
    });

    await userEvent.click(goalCard);
    await clickNext();

    expect(mockNavigate).toHaveBeenCalled();
  });
});
