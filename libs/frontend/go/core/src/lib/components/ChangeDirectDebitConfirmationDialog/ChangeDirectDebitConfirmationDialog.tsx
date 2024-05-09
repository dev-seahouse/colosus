import {
  Box,
  Button,
  DialogWithCloseButton,
  Stack,
  Typography,
} from '@bambu/react-ui';

interface ChangeDirectDebitConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ChangeDirectDebitConfirmationDialog({
  open,
  onClose,
  onConfirm,
}: ChangeDirectDebitConfirmationDialogProps) {
  return (
    <DialogWithCloseButton
      open={open}
      onClose={onClose}
      dialogTitle={
        <Typography fontWeight={700} fontSize={'22px'}>
          Change direct debit setup
        </Typography>
      }
      dialogTitleId={'change-direct-debit-confirmation-dialog-title'}
      dialogDescriptionId={
        'change-direct-debit-confirmation-dialog-description'
      }
      actions={
        <Stack spacing={1}>
          <Button onClick={onConfirm}>Cancel and reapply direct debit</Button>
          <Button variant={'text'} onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      }
    >
      <Box mb={3}>
        <Typography>
          To change your direct debit, you'll need to start by canceling your
          existing direct debit and then reapplying for the new direct debit.
        </Typography>
      </Box>
    </DialogWithCloseButton>
  );
}

export default ChangeDirectDebitConfirmationDialog;
