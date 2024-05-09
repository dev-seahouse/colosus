import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  DialogActions,
} from '@bambu/react-ui';

export interface RestorePortfolioDefaultSettingsDialogProps {
  open?: boolean;
  handleClose?: () => void;
  handleRestoreSettings?: () => void;
}

export function RestorePortfolioDefaultSettingsDialog({
  open = false,
  handleClose,
  handleRestoreSettings,
}: RestorePortfolioDefaultSettingsDialogProps) {
  return (
    <Dialog
      maxWidth="xs"
      aria-labelledby="restore-subscription-dialog-title"
      open={open}
    >
      <DialogTitle id="restore-subscription-dialog-title">
        Are you sure you want to restore this portfolio to the default settings?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>You cannot undo this action.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRestoreSettings}>Restore system settings</Button>
        <Button onClick={handleClose} variant="text">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RestorePortfolioDefaultSettingsDialog;
