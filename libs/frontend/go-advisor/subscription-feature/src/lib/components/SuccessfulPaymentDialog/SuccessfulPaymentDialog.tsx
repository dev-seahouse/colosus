import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  Stack,
  Box,
  CircularProgress,
  Typography,
  DialogClose,
} from '@bambu/react-ui';
import type { DialogProps } from '@bambu/react-ui';
import { useGTMSubscriptionEvent } from '@bambu/go-advisor-analytics';
import { useEffect } from 'react';

import PaymentDetails from '../PaymentDetails/PaymentDetails';
import useGetSubscriptions from '../../hooks/useGetSubscriptions/useGetSubscriptions';

export interface SuccessfulPaymentDialogProps
  extends Pick<DialogProps, 'open'> {
  handleClose?: () => void;
}

export function SuccessfulPaymentDialog({
  open = false,
  handleClose,
}: SuccessfulPaymentDialogProps) {
  const { isLoading } = useGetSubscriptions();
  const gtmSubscriptionEvent = useGTMSubscriptionEvent();

  useEffect(() => {
    gtmSubscriptionEvent();
  }, [gtmSubscriptionEvent]);

  return (
    <Dialog
      maxWidth="md"
      aria-labelledby="successful-payment-dialog-title"
      open={open}
    >
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="space-around"
          alignItems="center"
          sx={{ width: 600, height: 300 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box py={3} px={2}>
          <DialogClose handleClose={handleClose} />
          <DialogTitle id="successful-payment-dialog-title">
            Thank you for your payment!
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Typography>You are now subscribed to Bambu GO.</Typography>
              <PaymentDetails />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Continue</Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
}

export default SuccessfulPaymentDialog;
