import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  DialogClose,
  Typography,
  Stack,
  Link,
} from '@bambu/react-ui';

export interface IncompleteCustodianDialogProps {
  handleClose: () => void;
  open: boolean;
}

export function IncompleteCustodianDialog({
  open,
  handleClose,
}: IncompleteCustodianDialogProps) {
  return (
    <Dialog
      maxWidth="md"
      aria-labelledby="incomplete-custodian-dialog"
      open={open}
    >
      <Box display="flex" sx={{ width: 600 }}>
        <Box py={3} px={2}>
          <DialogClose handleClose={handleClose} />
          <Stack spacing={2}>
            <DialogTitle id="incomplete-custodian-dialog-title">
              Your custodian onboarding is incomplete
            </DialogTitle>
            <DialogContent>
              <Stack spacing={4}>
                <Typography>
                  Before upgrading to Transact, please ensure that you have
                  completed all required onboarding steps with our custodian,
                  Wealth Kernel.
                </Typography>
                <Typography>
                  Need help on this? Contact us at{' '}
                  <Link to={`mailto:support@bambu.co}`}>support@bambu.co</Link>{' '}
                  to confirm your onboarding status and receive guidance on any
                  outstanding steps.
                </Typography>
              </Stack>
            </DialogContent>
          </Stack>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

export default IncompleteCustodianDialog;
