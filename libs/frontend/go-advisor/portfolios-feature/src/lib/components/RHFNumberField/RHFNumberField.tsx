import type { TextFieldProps } from '@bambu/react-ui';
import { TextField } from '@bambu/react-ui';
import type { FieldValues, UseControllerProps } from 'react-hook-form';
import { useController } from 'react-hook-form';
import type {
  NumberFormatValues,
  NumericFormatProps,
  SourceInfo,
} from 'react-number-format';
import { NumericFormat } from 'react-number-format';

export function RHFNumberField<T extends FieldValues>(
  props: UseControllerProps<T> &
    (Omit<TextFieldProps, 'type' | 'value'> &
      NumericFormatProps<TextFieldProps>)
) {
  const { onValueChange, ...rest } = props;
  const {
    field,
    fieldState: { error },
  } = useController(rest);

  const { ref, onChange, ...fieldProps } = field;

  const handleValueChange = (v: NumberFormatValues, s: SourceInfo) => {
    props.onValueChange?.(v, s);
    onChange(v.floatValue);
  };

  return (
    <NumericFormat
      inputRef={ref}
      value={field.value}
      onValueChange={handleValueChange}
      error={!!error}
      customInput={TextField}
      decimalScale={0}
      allowNegative={false}
      {...rest}
    />
  );
}

export default RHFNumberField;
