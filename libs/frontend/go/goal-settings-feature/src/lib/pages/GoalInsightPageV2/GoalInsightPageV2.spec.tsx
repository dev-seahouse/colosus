import { render } from '@bambu/react-test-utils';

import GoalInsightPageV2 from './GoalInsightPageV2';

describe('GoalInsightPageV2', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GoalInsightPageV2 />);
    expect(baseElement).toBeTruthy();
  });
});
