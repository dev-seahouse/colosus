import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { ProfileFormState } from '../ProfileForm/ProfileForm';
import type { UpdateProfileFormState } from '../UpdateProfileForm/UpdateProfileForm';

export function BusinessNameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormState | UpdateProfileFormState>();
  return (
    <TextField
      {...register('businessName')}
      label="Business name"
      inputProps={{
        'data-testid': 'business-name-input',
        id: 'business-name-input',
      }}
      InputLabelProps={{
        htmlFor: 'business-name-input',
      }}
      fullWidth
      error={!!errors.businessName}
      helperText={errors.businessName?.message}
    />
  );
}

export default BusinessNameField;
