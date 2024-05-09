import { render } from '@testing-library/react';

import GoalDetails from './GoalDetails';

describe('GoalDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GoalDetails />);
    expect(baseElement).toBeTruthy();
  });
});
