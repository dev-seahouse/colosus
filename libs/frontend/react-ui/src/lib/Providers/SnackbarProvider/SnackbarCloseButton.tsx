import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { closeSnackbar } from 'notistack';

import type { IconButtonProps } from '@mui/material/IconButton';
import type { SnackbarKey } from 'notistack';

export interface SnackbarCloseBtnProps
  extends Omit<IconButtonProps, 'size' | 'onClick'> {
  snackbarKey: SnackbarKey;
}

export const SnackbarCloseButton = ({
  snackbarKey,
  ...rest
}: SnackbarCloseBtnProps) => {
  return (
    <IconButton
      size="small"
      onClick={() => closeSnackbar(snackbarKey)}
      {...rest}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default SnackbarCloseButton;
