import type { FormControlLabelProps } from '@mui/material';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  styled,
} from '@mui/material';
import { forwardRef } from 'react';
import Checkbox from '../Checkbox/Checkbox';

export interface FormControlCheckboxProps
  extends Omit<FormControlLabelProps, 'label' | 'control'> {
  label: React.ReactNode;
  error?: { message?: string | undefined };
}

const StyledFormControlLabel = styled(FormControlLabel)<{
  error: FormControlCheckboxProps['error'];
}>(({ theme, error }) => ({
  marginLeft: 0,
  '& .MuiCheckbox-root': {
    marginRight: '12px',
  },
  '& .MuiSvgIcon-root': {
    ...(error?.message
      ? {
          color: theme.palette.error.main,
        }
      : {}),
  },
}));

export const FormControlCheckbox = forwardRef(function FormControlCheckbox(
  { label, error, ...props }: FormControlCheckboxProps,
  ref
) {
  return (
    <FormControl error={!!error}>
      <StyledFormControlLabel
        {...props}
        error={error}
        control={<Checkbox />}
        label={label}
        inputRef={ref}
      />
      {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
    </FormControl>
  );
});

export default FormControlCheckbox;
