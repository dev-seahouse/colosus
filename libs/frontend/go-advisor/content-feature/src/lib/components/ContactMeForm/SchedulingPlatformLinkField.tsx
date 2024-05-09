import { TextField } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { ContactMeFormState } from './ContactMeForm';

export const SchedulingPlatformLinkField = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ContactMeFormState>();

  return (
    <TextField
      inputProps={{
        'data-testid': 'contact-link-input',
        id: 'contact-link-input',
      }}
      InputLabelProps={{
        htmlFor: 'contact-link-input',
      }}
      FormHelperTextProps={{
        id: 'contact-link-input-error',
      }}
      {...register('contactLink')}
      label="Public scheduling link (Optional)"
      error={!!errors.contactLink}
      helperText={
        errors.contactLink?.message ??
        'This could be a link to an external scheduling tool like Calendly.'
      }
    />
  );
};

export default SchedulingPlatformLinkField;
