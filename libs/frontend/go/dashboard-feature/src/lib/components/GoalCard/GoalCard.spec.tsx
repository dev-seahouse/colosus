import GoalCard from './GoalCard';
import { render } from '@bambu/react-test-utils';

describe('GoalCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <GoalCard
        goalTitle={''}
        goalValue={0}
        goalTimeframe={0}
        goalStatus={'Inactive'}
        portfolioValue={0}
        cumulativeReturn={0}
        timeLeft={''}
        recurringDeposit={0}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
