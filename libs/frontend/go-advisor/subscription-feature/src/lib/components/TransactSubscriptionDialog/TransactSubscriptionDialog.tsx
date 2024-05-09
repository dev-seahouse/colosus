import type { DialogProps } from '@bambu/react-ui';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Stack,
  Box,
  IconButton,
} from '@bambu/react-ui';

export interface TransactSubscriptionDialogProps
  extends Pick<DialogProps, 'open'> {
  onClose: () => void;
  submitSubscriptionRequest: () => void;
}

export function TransactSubscriptionDialog({
  onClose,
  open,
  submitSubscriptionRequest,
}: TransactSubscriptionDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[800],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Stack sx={{ px: 3, pb: 2 }}>
        <Stack>
          <DialogTitle id="transact-subscription-dialog-title" fontWeight="700">
            Thank you for your interest in Transact
          </DialogTitle>
        </Stack>
        <Stack>
          <DialogContent id="transact-subscription-dialog-content">
            <Stack spacing={4}>
              <Box sx={{ wordWrap: 'break-word' }}>
                As you are not yet verified to access our transactional robo
                services, we will start you on a Connect subscription first
                ($99/mo.).
              </Box>
              <Box sx={{ wordWrap: 'break-word' }}>
                By subscribing and starting verification today, we’ll be able to
                ensure that you can make the most of all of our Transact
                features.
              </Box>
              <Box sx={{ wordWrap: 'break-word' }}>
                Once you are verified, we’ll guide you on how to upgrade to
                Transact and get your platform ready for launch.
              </Box>
            </Stack>
          </DialogContent>
        </Stack>
        <DialogActions>
          <Button onClick={submitSubscriptionRequest}>Proceed</Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
}

export default TransactSubscriptionDialog;
