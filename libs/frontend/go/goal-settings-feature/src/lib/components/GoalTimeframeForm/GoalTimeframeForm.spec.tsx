import { render } from '@bambu/react-test-utils';

import GoalTimeframeForm from './GoalTimeframeForm';

describe('GoalTimeframeForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GoalTimeframeForm />);
    expect(baseElement).toBeTruthy();
  });
});
