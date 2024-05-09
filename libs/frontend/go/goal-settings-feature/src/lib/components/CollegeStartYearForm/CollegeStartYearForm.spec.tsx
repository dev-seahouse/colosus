import { render } from '@bambu/react-test-utils';

import CollegeStartYearForm from './CollegeStartYearForm';

vi.mock('@harnessio/ff-react-client-sdk', async () => {
  const mod = await vi.importActual<
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    typeof import('@harnessio/ff-react-client-sdk')
  >('@harnessio/ff-react-client-sdk');
  return {
    ...mod,
    useFeatureFlag: vi.fn().mockReturnValue(true),
  };
});

describe('CollegeStartYearForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CollegeStartYearForm />);
    expect(baseElement).toBeTruthy();
  });
});
