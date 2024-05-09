import { render, userEvent, screen } from '@bambu/react-test-utils';

import ContactMeForm from './ContactMeForm';

vi.mock('@harnessio/ff-react-client-sdk', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const mod = await vi.importActual<
    typeof import('@harnessio/ff-react-client-sdk')
  >('@harnessio/ff-react-client-sdk');
  return {
    ...mod,
    useFeatureFlag: vi.fn().mockReturnValue(true),
  };
});

describe('ContactMeForm', () => {
  it('should display error message if contact link is invalid', async () => {
    render(<ContactMeForm />);

    await userEvent.type(screen.getByTestId('contact-link-input'), 'some-link');

    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText(/please enter a valid link/i)).toBeDefined();
  });
});
