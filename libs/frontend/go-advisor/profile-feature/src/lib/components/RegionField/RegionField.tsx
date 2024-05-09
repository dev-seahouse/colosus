import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { ProfileFormState } from '../ProfileForm/ProfileForm';
import type { UpdateProfileFormState } from '../UpdateProfileForm/UpdateProfileForm';

export function RegionField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormState | UpdateProfileFormState>();
  return (
    <TextField
      {...register('region')}
      label="State or region"
      inputProps={{
        'data-testid': 'region-input',
        id: 'region-input',
      }}
      InputLabelProps={{
        htmlFor: 'region-input',
      }}
      fullWidth
      error={!!errors.region}
      helperText={errors.region?.message}
    />
  );
}

export default RegionField;
