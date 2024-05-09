import GoalDetailsTabs from './GoalDetailsTabs';
import { render } from '@bambu/react-test-utils';

describe('GoalDetailsTab', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GoalDetailsTabs />);
    expect(baseElement).toBeTruthy();
  });
});
