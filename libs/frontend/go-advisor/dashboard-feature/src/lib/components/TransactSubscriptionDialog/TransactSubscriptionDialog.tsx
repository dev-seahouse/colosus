import { useState } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  DialogClose,
  Stack,
} from '@bambu/react-ui';
import { DateTime } from 'luxon';

import useGetSubscriptionUpgradeDetails from '../../hooks/useGetSubscriptionUpgradeDetails/useGetSubscriptionUpgradeDetails';
import useUpgradeSubscription from '../../hooks/useUpgradeSubscription/useUpgradeSubscription';

import {
  useSelectUserSubscriptionIdQuery,
  useProfileDetails,
} from '@bambu/go-advisor-core';

export interface TransactSubscriptionDialogProps {
  handleClose: () => void;
  open: boolean;
}

export function TransactSubscriptionDialog({
  open,
  handleClose,
}: TransactSubscriptionDialogProps) {
  const { refetch } = useProfileDetails();
  const [subscriptionUpgraded, setSubscriptionUpgraded] = useState(false);

  const { data: requestId } = useSelectUserSubscriptionIdQuery();
  const { mutate } = useUpgradeSubscription({
    onSuccess: () => {
      setSubscriptionUpgraded(true);
    },
  });
  const { data } = useGetSubscriptionUpgradeDetails(requestId as string);
  const handleUpgradeSubscription = () => mutate();

  const handleCloseModal = () => {
    refetch();
    handleClose();
  };

  if (!data) return;
  const { cost, startDate } = data;

  const date = DateTime.fromISO(startDate).toFormat('dd LLL yyyy');

  if (subscriptionUpgraded) {
    return (
      <Dialog
        maxWidth="md"
        aria-labelledby="transact-upgrade-dialog"
        open={open}
      >
        <Box display="flex" sx={{ width: 600 }}>
          <Box py={3} px={2}>
            <DialogClose handleClose={handleClose} />
            <DialogTitle id="transact-upgrade-dialog-title">
              Thank you for your payment!
            </DialogTitle>
            <DialogContent>
              <Stack spacing={4}>
                <Stack>
                  <Typography>
                    You are now subscribed to Bambu GO (Transact)
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={4}>
                  <Stack spacing={2}>
                    <Typography>Subscription plan</Typography>
                    <Typography>Upgrade cost today</Typography>{' '}
                  </Stack>
                  <Stack spacing={2}>
                    <Typography fontWeight="bold">Transact</Typography>
                    <Typography fontWeight="bold">US$${cost}</Typography>
                  </Stack>
                </Stack>
                <Stack>
                  <Box
                    sx={{
                      background: '#F2F2F2',
                      padding: '1rem',
                      borderRadius: '4px',
                    }}
                  >
                    <Typography>
                      You’ll pay <b>US$499/mo.</b> on your subsequent billing
                      cycles, starting on <b>{date}</b>
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseModal}>Continue</Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog maxWidth="md" aria-labelledby="transact-upgrade-dialog" open={open}>
      <Box display="flex" sx={{ width: 600 }}>
        <Box py={3} px={2}>
          <DialogClose handleClose={handleClose} />
          <DialogTitle id="transact-upgrade-dialog-title">
            Upgrade your subscription to share your transactional robo-advisor.
          </DialogTitle>
          <DialogContent>
            <Stack spacing={4}>
              <Stack direction="row" spacing={4}>
                <Stack spacing={2}>
                  <Typography>Current plan</Typography>
                  <Typography>New plan</Typography>{' '}
                  <Typography>Upgrade cost today</Typography>
                </Stack>
                <Stack spacing={2}>
                  <Typography fontWeight="bold">Connect (US$99/mo.)</Typography>
                  <Typography fontWeight="bold">
                    Transact (US$499/mo.)
                  </Typography>
                  <Stack>
                    <Stack direction="row" spacing={1}>
                      <Typography
                        fontWeight="bold"
                        sx={{ color: 'red', textDecoration: 'line-through' }}
                      >
                        US$499
                      </Typography>
                      <Typography fontWeight="bold">US${cost}</Typography>
                    </Stack>
                    <Typography>
                      Prorated based on your usage of the current plan
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack>
                <Box
                  sx={{
                    background: '#F2F2F2',
                    padding: '1rem',
                    borderRadius: '4px',
                  }}
                >
                  <Typography>
                    You’ll pay <b>US$499/mo.</b> on your subsequent billing
                    cycles, starting on <b>{date}</b>
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleUpgradeSubscription}>Upgrade now</Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

export default TransactSubscriptionDialog;
