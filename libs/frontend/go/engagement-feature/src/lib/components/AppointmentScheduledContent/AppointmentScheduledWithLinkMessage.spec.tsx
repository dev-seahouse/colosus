import { render, screen } from '@bambu/react-test-utils';
import AppointmentScheduledWithLinkMessage from './AppointmentScheduledWithLinkMessage';

describe('AppointmentScheduledWithLinkMessage', () => {
  it('should display email sent message if user requests for financial insight email', () => {
    render(<AppointmentScheduledWithLinkMessage />, {
      path: '/appointment-scheduled?email=true',
    });

    expect(screen.getByTestId('email-with-link-sent-true')).toBeDefined();
  });

  it('should display email sent message if user does not request for financial insight email', () => {
    render(<AppointmentScheduledWithLinkMessage />, {
      path: '/appointment-scheduled?email=false',
    });

    expect(screen.getByTestId('email-with-link-sent-false')).toBeDefined();
  });
});
