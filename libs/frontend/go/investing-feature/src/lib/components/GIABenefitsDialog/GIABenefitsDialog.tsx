import type { DialogWithCloseButtonProps } from '@bambu/react-ui';
import { DialogWithCloseButton, Typography } from '@bambu/react-ui';

/**
 * Dialog to display the benefits of a GIA account
 */
export function GIABenefitsDialog({
  open,
  onClose,
}: Pick<DialogWithCloseButtonProps, 'open' | 'onClose'>) {
  return (
    <DialogWithCloseButton
      open={open}
      onClose={onClose}
      dialogTitle={
        <Typography component={'h1'} fontSize={'22px'} fontWeight={'bold'}>
          General investment account (GIA) benefits
        </Typography>
      }
      dialogTitleId={'gia-benefits-dialog-title'}
      dialogDescriptionId={'gia-benefits-dialog-description'}
    >
      <Typography variant={'body1'}>
        You have the flexibility with a general investment account (GIA) to
        invest as much or as little as you want, and can contribute a regular
        monthly amount, a lump sum or both. Choosing a GIA allows you to invest
        in a wide range of funds, shares and investment trusts.
      </Typography>
    </DialogWithCloseButton>
  );
}

export default GIABenefitsDialog;
