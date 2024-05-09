import { render, userEvent, screen } from '@bambu/react-test-utils';

import LocationForm from './LocationForm';

const enterPostalCode = async (postalCode = '12345') => {
  const postalCodeInput = screen.getByLabelText('Postal code');

  await userEvent.type(postalCodeInput, postalCode);
};

const submitLocationForm = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
};

describe('LocationForm', () => {
  beforeEach(() => {
    render(<LocationForm />);
  });

  it('should display error message if postal code contains invalid character', async () => {
    await enterPostalCode('abc');
    await submitLocationForm();

    expect(
      screen.getByText(/please provide a valid postal code/i)
    ).toBeDefined();
  });

  it('should allow the user to submit if postal code is valid', async () => {
    await enterPostalCode();
    await submitLocationForm();

    expect(
      screen.queryByText(/please provide a valid postal code/i)
    ).toBeNull();
  });
});
