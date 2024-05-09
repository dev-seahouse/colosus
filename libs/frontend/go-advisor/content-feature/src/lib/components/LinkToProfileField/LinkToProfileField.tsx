import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { ProfileSummaryFormState } from '../ProfileSummaryForm/ProfileSummaryForm';

export function LinkToProfileField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileSummaryFormState>();
  return (
    <TextField
      {...register('fullProfileLink')}
      inputProps={{
        'data-testid': 'profile-link-input',
        id: 'profile-link-input',
      }}
      InputLabelProps={{
        htmlFor: 'profile-link-input',
      }}
      label="Link to my full profile (optional)"
      error={!!errors.fullProfileLink}
      helperText={
        errors.fullProfileLink?.message ??
        'This could be your LinkedIn profile or a bio page on your website'
      }
    />
  );
}

export default LinkToProfileField;
