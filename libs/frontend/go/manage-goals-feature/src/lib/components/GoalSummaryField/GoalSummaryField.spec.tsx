import GoalSummaryField from './GoalSummaryField';
import { render } from '@bambu/react-test-utils';

describe('GoalSummaryField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <GoalSummaryField title={'blbal'} value={'blbal'} isLoading={false} />
    );
    expect(baseElement).toBeTruthy();
  });
});
