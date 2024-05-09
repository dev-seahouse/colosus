import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { ProfileFormState } from '../ProfileForm/ProfileForm';
import type { UpdateProfileFormState } from '../UpdateProfileForm/UpdateProfileForm';

export function LastNameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormState | UpdateProfileFormState>();
  return (
    <TextField
      {...register('lastName')}
      label="Last name"
      inputProps={{
        'data-testid': 'last-name-input',
        id: 'last-name-input',
      }}
      InputLabelProps={{
        htmlFor: 'last-name-input',
      }}
      fullWidth
      error={!!errors.lastName}
      helperText={errors.lastName?.message}
    />
  );
}

export default LastNameField;
