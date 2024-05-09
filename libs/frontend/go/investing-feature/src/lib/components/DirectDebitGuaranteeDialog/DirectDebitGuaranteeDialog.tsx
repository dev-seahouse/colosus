import type { DialogProps } from '@bambu/react-ui';
import {
  Stack,
  styled,
  Typography,
  DialogWithCloseButton,
  Box,
} from '@bambu/react-ui';

import DirectDebitGuaranteeLogo from '../../../assets/direct_debit_gurantee_logo.svg';

const StyledDirectDebitGuaranteeLogo = styled('img')({
  aspectRadio: '1/3',
  height: '36px',
});
export interface DirectDebitGuaranteeDialogProps
  extends Pick<DialogProps, 'open'> {
  onClose: () => void;
}

function DialogTitle() {
  return (
    <Stack spacing={2} alignItems={'flex-start'}>
      <StyledDirectDebitGuaranteeLogo
        src={DirectDebitGuaranteeLogo}
        alt="Direct Debit guarantee"
      />
      <Typography component={'h1'} fontWeight={'bold'} fontSize={'22px'}>
        Direct debit guarantee
      </Typography>
    </Stack>
  );
}

export function DirectDebitGuaranteeDialog({
  onClose,
  open,
}: DirectDebitGuaranteeDialogProps) {
  return (
    <DialogWithCloseButton
      dialogTitleId="direct-debit-guarantee-dialg-title"
      dialogDescriptionId="direct-debit-guarantee-dialog-description"
      fullScreen
      open={open}
      dialogTitle={<DialogTitle />}
      onClose={onClose}
      contentWrapperStyles={{ maxWidth: 'sm', margin: 'auto' }}
    >
      <Box maxWidth={'md'}>
        <Typography>
          The Guarantee is offered by all banks and building societies that
          accept instructions to pay Direct Debits. If there are any changes to
          the amount, date or frequency of your Direct Debit GC re WealthKernel
          will notify you (normally 2 working days) in advance of your account
          being debited or as otherwise agreed. If you request GC re
          WealthKernel to collect a payment, confirmation of the amount and date
          will be given to you at the time of the request.
        </Typography>
        <Typography>
          If an error is made in the payment of your Direct Debit, by GC re
          WealthKernel or your bank or building society, you are entitled to a
          full and immediate refund of the amount paid from your bank or
          building society. If you receive a refund you are not entitled to, you
          must pay it back when GC re WealthKernel asks you to. You can cancel a
          Direct Debit at any time simply by contacting your bank or building
          society. Written confirmation may be required. Please also notify GC
          re WealthKernel.
        </Typography>
      </Box>
    </DialogWithCloseButton>
  );
}

export default DirectDebitGuaranteeDialog;
