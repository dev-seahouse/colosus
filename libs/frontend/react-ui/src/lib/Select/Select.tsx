import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MuiSelect from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import _kebabCase from 'lodash/kebabCase';
import { forwardRef } from 'react';
import type { SelectProps as MuiSelectProps } from '@mui/material/Select';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

export interface SelectProps extends Omit<MuiSelectProps, 'labelId'> {
  helperText?: FormHelperTextProps['children'];
}

const DEFAULT_MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 5 * 36 + 8,
    },
  },
};

/**
 * modified MUI Select component, exposes the same API as MUI TextField for consistency in form writing
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const {
    children,
    fullWidth,
    error,
    disabled,
    label = 'Select',
    helperText,
    ...rest
  } = props;
  const id = `${_kebabCase(typeof label === 'string' ? label : 'Select')}`;
  const labelId = `${id}-label`;

  return (
    <FormControl
      error={error}
      disabled={disabled}
      fullWidth={fullWidth}
      ref={ref}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect
        id={id}
        labelId={labelId}
        label={label}
        MenuProps={DEFAULT_MENU_PROPS}
        {...rest}
      >
        {children}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
});

export default Select;
