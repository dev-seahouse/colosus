import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { ProfileFormState } from '../ProfileForm/ProfileForm';
import type { UpdateProfileFormState } from '../UpdateProfileForm/UpdateProfileForm';

export function JobTitleField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileFormState | UpdateProfileFormState>();
  return (
    <TextField
      {...register('jobTitle')}
      label="Job title"
      inputProps={{
        'data-testid': 'job-title-input',
        id: 'job-title-input',
      }}
      InputLabelProps={{
        htmlFor: 'job-title-input',
      }}
      fullWidth
      error={!!errors.jobTitle}
      helperText={errors.jobTitle?.message}
    />
  );
}

export default JobTitleField;
