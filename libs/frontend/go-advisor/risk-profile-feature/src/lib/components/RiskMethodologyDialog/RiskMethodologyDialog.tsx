import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Box,
  Button,
} from '@bambu/react-ui';
import type { DialogProps } from '@bambu/react-ui';

export interface RiskMethodologyDialogProps {
  open: DialogProps['open'];
  handleClose?: () => void;
}

export function RiskMethodologyDialog({
  open,
  handleClose,
}: RiskMethodologyDialogProps) {
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      aria-labelledby="risk-methodology-dialog-title"
      aria-describedby="risk-methodology-dialog-description"
    >
      <Box p={2}>
        <DialogClose handleClose={handleClose} />
        <DialogTitle id="risk-methodology-dialog-title">
          Risk scoring & Methodology
        </DialogTitle>
        <DialogContent id="risk-methodology-dialog-description">
          <Stack spacing={2}>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
              vitae dignissim ante, sed pretium leo. Nullam maximus justo diam,
              nec imperdiet nisi consectetur et. Curabitur et euismod dui, ac
              eleifend odio. Quisque dapibus vestibulum ante, eget pellentesque
              enim ornare eget. Integer enim felis, bibendum sit amet posuere
              ut, suscipit sit amet purus. Pellentesque et vehicula sem.
            </Typography>
            <Typography>
              Nulla quis lobortis tortor. Nunc nec fermentum ex. Vestibulum
              sodales dictum sapien ut dictum. Nunc pulvinar laoreet lacus ut
              dignissim. Sed ac placerat dolor, non consectetur leo. Integer at
              leo rutrum quam ultrices mollis. Ut pulvinar condimentum leo sed
              aliquam. Donec auctor placerat ipsum quis vehicula. Quisque et
              vehicula ex.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Got it</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default RiskMethodologyDialog;
