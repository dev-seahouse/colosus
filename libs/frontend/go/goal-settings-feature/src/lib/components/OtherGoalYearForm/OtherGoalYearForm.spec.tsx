import { render, userEvent, screen } from '@bambu/react-test-utils';

import OtherGoalYearForm from './OtherGoalYearForm';

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

const submitGoalYearForm = async () => {
  const submitButton = screen.getByRole('button', {
    name: 'Next',
  });

  await userEvent.click(submitButton);
};

describe('OtherGoalYearForm', () => {
  beforeEach(() => {
    render(<OtherGoalYearForm />);
  });

  it('should display error message when goalYear is invalid', async () => {
    await submitGoalYearForm();

    expect(
      await screen.queryByText('Your goal year is required')
    ).toBeDefined();
  });
});
