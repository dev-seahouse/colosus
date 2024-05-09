import type { DialogWithCloseButtonProps } from '@bambu/react-ui';
import { DialogWithCloseButton, MuiLink, Typography } from '@bambu/react-ui';

export function WealthKernelContactInfoDialog({
  onClose,
  open,
}: {
  onClose: DialogWithCloseButtonProps['onClose'];
  open: DialogWithCloseButtonProps['open'];
}) {
  return (
    <DialogWithCloseButton
      open={open}
      onClose={onClose}
      dialogTitle={
        <Typography component={'h1'} fontWeight={'bold'} fontSize={'22px'}>
          Wealthkernel
        </Typography>
      }
      dialogTitleId={'wealth-kernel-contact-info-title'}
      dialogDescriptionId={'wealth-kernel-contact-info-description'}
    >
      If you have any questions about your direct debit please contact{' '}
      <MuiLink href={'mailto:directdebits@wealthkernel.com'}>
        directdebits@wealthkernel.com
      </MuiLink>
    </DialogWithCloseButton>
  );
}

export default WealthKernelContactInfoDialog;
