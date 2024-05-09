import { render, screen } from '@bambu/react-test-utils';
import PaymentDialogProvider from './PaymentDialogProvider';

describe('PaymentDialogProvider', () => {
  it('should render payment dialog if URL has successful_payment param === true', () => {
    render(<PaymentDialogProvider />, {
      path: '/?successful_payment=true',
    });

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
