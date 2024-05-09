import { render } from '@bambu/react-test-utils';

import TotalCollegeFeesForm from './TotalCollegeFeesForm';

describe('TotalCollegeFeesForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TotalCollegeFeesForm />);
    expect(baseElement).toBeTruthy();
  });
});
