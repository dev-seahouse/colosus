import {
  renderWithDataRouter,
  userEvent,
  screen,
} from '@bambu/react-test-utils';

import RetirementAgeForm from './RetirementAgeForm';

describe('RetirementAgeForm', () => {
  it('should display error if retirement age is lower than user`s current age', async () => {
    renderWithDataRouter(<RetirementAgeForm />);

    const retirementAgeInput = await screen.findByLabelText('Retirement age');

    await userEvent.type(retirementAgeInput, '17');
    await userEvent.click(await screen.findByRole('button', { name: 'Next' }));

    expect(
      await screen.queryByText(
        'Your retirement age should be greater than your current age'
      )
    ).toBeDefined();
  });

  it('should display error if retirement age is greather than 81', async () => {
    renderWithDataRouter(<RetirementAgeForm />);

    const retirementAgeInput = await screen.findByLabelText('Retirement age');

    await userEvent.type(retirementAgeInput, '82');
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(
      await screen.queryByText(
        'Your retirement age should not be greater than 81 years old'
      )
    ).toBeDefined();
  });
});
