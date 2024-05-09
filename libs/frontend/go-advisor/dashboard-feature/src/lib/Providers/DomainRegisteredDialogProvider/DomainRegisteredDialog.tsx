import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  Button,
  Box,
} from '@bambu/react-ui';
import type { DialogProps } from '@bambu/react-ui';

export interface DomainRegisteredDialogProps extends Pick<DialogProps, 'open'> {
  handleClose?: () => void;
}

export function DomainRegisteredDialog({
  open,
  handleClose,
}: DomainRegisteredDialogProps) {
  return (
    <Dialog open={open}>
      <Box px={3} py={2}>
        <DialogTitle>Congratulations! Your domain is being set up </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <DialogContentText>
              While we’re doing that, please continue to set up your
              robo-advisor.
            </DialogContentText>
            <Box display="flex" sx={{ gap: 1 }}>
              <Button onClick={handleClose}>Continue</Button>
            </Box>
          </Stack>
        </DialogContent>
      </Box>
    </Dialog>
  );
}

export default DomainRegisteredDialog;
