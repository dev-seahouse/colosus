import { PatternFormat } from 'react-number-format';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';
import type { PatternFormatProps } from 'react-number-format';

export interface PhoneFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'defaultValue' | 'type' | 'value'>,
    Pick<
      PatternFormatProps,
      'onValueChange' | 'type' | 'value' | 'defaultValue'
    > {
  format?: string;
}

export function PhoneField({
  format = '+1 (###) ### ####',
  ...rest
}: PhoneFieldProps) {
  return <PatternFormat format={format} {...rest} customInput={TextField} />;
}

export default PhoneField;
