import { render, screen } from '@bambu/react-test-utils';
import AppointmentScheduledMessage from './AppointmentScheduledMessage';

describe('AppointmentScheduledMessage', () => {
  it('should display email sent message if user requests for financial insight email', () => {
    render(<AppointmentScheduledMessage />, {
      path: '/appointment-scheduled?email=true',
    });

    expect(screen.getByTestId('email-sent-true')).toBeDefined();
  });

  it('should display email sent message if user does not request for financial insight email', () => {
    render(<AppointmentScheduledMessage />, {
      path: '/appointment-scheduled?email=false',
    });

    expect(screen.getByTestId('email-sent-false')).toBeDefined();
  });
});
