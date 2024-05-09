import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { PlatformSetupFormState } from '../PlatformSetupForm/PlatformSetupForm';

export function BrandFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlatformSetupFormState>();

  return (
    <TextField
      inputProps={{
        'data-testid': 'tradeName-input',
        id: 'tradeName-input',
      }}
      InputLabelProps={{
        htmlFor: 'tradeName-input',
      }}
      {...register('tradeName')}
      fullWidth
      label="Robo-advisor name"
      helperText={
        errors?.tradeName
          ? errors.tradeName.message
          : 'Your robo-advisor name must not exceed 20 characters'
      }
      error={!!errors.tradeName}
    />
  );
}

export default BrandFields;
