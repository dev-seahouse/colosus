import {
  Button,
  DialogWithCloseButton,
  Stack,
  Typography,
} from '@bambu/react-ui';

interface PaymentSettingsMaxDailyLimitDialogProps {
  onOkClick: () => void;
  onCancelClick: () => void;
  open: boolean;
  disabled: boolean;
  isLoading: boolean;
  isCancelDisabled: boolean;
}
export function PaymentSettingsMaxDailyLimitDialog({
  open,
  onCancelClick,
  onOkClick,
  disabled,
  isCancelDisabled,
  isLoading,
}: PaymentSettingsMaxDailyLimitDialogProps) {
  return (
    <DialogWithCloseButton
      open={open}
      onClose={onCancelClick}
      dialogTitle={
        <Typography fontWeight={700} fontSize={'22px'}>
          Daily Direct Debit limit transaction
        </Typography>
      }
      dialogTitleId={''}
      dialogDescriptionId={''}
      actions={
        <Stack direction={'row'} py={2} spacing={2}>
          <Button onClick={onOkClick} disabled={disabled} isLoading={isLoading}>
            Ok, proceed
          </Button>
          <Button
            variant={'outlined'}
            onClick={onCancelClick}
            disabled={isCancelDisabled}
          >
            Cancel
          </Button>
        </Stack>
      }
    >
      <Typography>
        Your contribution exceeds the daily Direct Debit amount. We'll adjust it
        to meet the daily transaction limit, up to $2,000.
      </Typography>
      <Typography>
        Here's your next step:
        <br />
        Make <strong>daily</strong> deposits until you reach your desired
        contribution amount using the side menu on your goal details page.
      </Typography>
    </DialogWithCloseButton>
  );
}

export default PaymentSettingsMaxDailyLimitDialog;
