import { render } from '@bambu/react-test-utils';

import ProfileSummaryForm from './ProfileSummaryForm';

describe('ProfileSummaryForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProfileSummaryForm />);
    expect(baseElement).toBeTruthy();
  });
});
