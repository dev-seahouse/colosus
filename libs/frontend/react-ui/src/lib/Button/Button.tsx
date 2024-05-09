import MuiButton from '@mui/material/Button';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { forwardRef } from 'react';

export interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading = false, endIcon, ...rest }, ref) => {
    return (
      <MuiButton
        endIcon={
          isLoading ? <CircularProgress color="inherit" size="1rem" /> : endIcon
        }
        {...rest}
        disabled={isLoading || rest.disabled}
      />
    );
  }
);

export default Button;
