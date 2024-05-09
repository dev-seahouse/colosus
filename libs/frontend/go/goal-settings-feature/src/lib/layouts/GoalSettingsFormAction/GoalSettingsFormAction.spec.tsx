import { render } from '@testing-library/react';

import GoalSettingsFormAction from './GoalSettingsFormAction';

describe('GoalSettingsFormAction', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GoalSettingsFormAction />);
    expect(baseElement).toBeTruthy();
  });
});
