import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { ProfileFormState } from '../ProfileForm/ProfileForm';
import type { UpdateProfileFormState } from '../UpdateProfileForm/UpdateProfileForm';

export function FirstNameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormState | UpdateProfileFormState>();
  return (
    <TextField
      {...register('firstName')}
      label="First name"
      inputProps={{
        'data-testid': 'first-name-input',
        id: 'first-name-input',
      }}
      InputLabelProps={{
        htmlFor: 'first-name-input',
      }}
      fullWidth
      error={!!errors.firstName}
      helperText={errors.firstName?.message}
    />
  );
}

export default FirstNameField;
