import { render } from '@bambu/react-test-utils';

import ConfigureGoalsDataGrid from './ConfigureGoalsDataGrid';

describe('GoalConfigDataGrid', () => {
  it.skip('should render successfully', () => {
    const { baseElement } = render(<ConfigureGoalsDataGrid />);
    expect(baseElement).toBeTruthy();
  });
});
