import type { ChangeEvent, ReactNode } from 'react';
import { useId } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@bambu/react-ui';
import {
  useController,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';

type Radio = {
  value: any;
  label: string;
  disabled?: boolean;
};

export type RHFRadioGroupControlProps<T extends FieldValues> =
  UseControllerProps<T> & {
    // the data of actual radio, in label and value format, optionally disabled
    radios: ReadonlyArray<Radio>;
    // label is required because we need to know what to use for the aria-labelledby
    label: ReactNode;
    // hideLabel is optional because sometimes we want to hide the label but still need the aria-labelledby
    hideLabel?: boolean;
    // direction is optional because sometimes we want to display the radios in a column
    direction?: 'row' | 'column';
    // name is required, otherwise RHF would not be able to register the field
    name: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  };

/**
 * Radio group for react-hook-form, only allows one selection
 * !important
 * since event.target.value is always string, this component only supports string value by default
 * however,boolean type suport is added for convenience, so if you want to use boolean, or object, or number,
 * or anything else, you need to add it to the handleChange method , check the type, and send it to RHF onChange to
 * support the value type you want, currently only boolean and string type are supported
 */
export function RHFRadioGroupControl<T extends FieldValues>(
  props: RHFRadioGroupControlProps<T>
) {
  const {
    radios,
    label,
    hideLabel,
    direction = 'row',
    onChange: propOnchange,
  } = props;
  const id = useId();
  const {
    field,
    fieldState: { error },
  } = useController(props);

  const { onChange, ...rest } = field;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    propOnchange?.(event);
    const { value } = event.target;
    if (value === 'true') return onChange(true);
    if (value === 'false') return onChange(false);
    return onChange(value);
  };

  return (
    <FormControl error={!!error}>
      <FormLabel id={`radio-group-label-${field.name}-${id}`}>
        {!hideLabel && label}
      </FormLabel>
      <RadioGroup
        {...rest}
        onChange={handleChange}
        row={direction === 'row'}
        aria-labelledby={`radio-group-label-${field.name}-${id}`}
      >
        {radios.map((radio) => (
          <FormControlLabel
            value={radio.value}
            control={<Radio />}
            label={radio.label}
            disabled={radio.disabled}
            key={radio.value}
          />
        ))}
      </RadioGroup>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}

export default RHFRadioGroupControl;
