import { SuccessfulPaymentDialog } from '@bambu/go-advisor-subscription-feature';
import usePaymentDialog from './usePaymentDialog';

export function PaymentDialogProvider() {
  const { open, handleClosePaymentDialog } = usePaymentDialog();

  if (!open) {
    return null;
  }

  return (
    <SuccessfulPaymentDialog
      open={open}
      handleClose={handleClosePaymentDialog}
    />
  );
}

export default PaymentDialogProvider;
