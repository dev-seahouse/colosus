import { GoalSummaryCard } from './GoalSummaryCard';
import { render } from '@bambu/react-test-utils';

describe('GoalSummaryCard', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<GoalSummaryCard />);
    expect(baseElement).toBeTruthy();
  });
});
