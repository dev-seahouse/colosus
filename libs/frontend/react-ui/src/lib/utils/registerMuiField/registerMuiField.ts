import type { UseFormRegisterReturn } from 'react-hook-form';
/**
 * For react hook form
 * a helper util as an alternative to
 * RHF Controller component for Mui input components
 * inputs e.g MuiTextField
 * @param param0
 * @returns
 * @example: <TextField {...registerMuiInputRef(register('inputName'))} />
 */
export const registerMuiField = ({
  ref: inputRef,
  ...rest
}: UseFormRegisterReturn) => ({
  inputRef,
  ...rest,
});
