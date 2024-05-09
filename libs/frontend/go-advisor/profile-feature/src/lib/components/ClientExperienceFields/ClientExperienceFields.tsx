import { TextField, Box, Typography } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import type { PlatformSetupFormState } from '../PlatformSetupForm/PlatformSetupForm';

export interface ClientExperienceFieldsProps {
  disabled?: boolean;
}

export function ClientExperienceFields({
  disabled = false,
}: ClientExperienceFieldsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<PlatformSetupFormState>();

  return (
    <Box display="flex" alignItems="center">
      <Box sx={{ width: 360, mr: 2 }}>
        <TextField
          disabled={disabled}
          inputProps={{
            'data-testid': 'subdomain-input',
            id: 'subdomain-input',
            placeholder: 'make-it-yours',
          }}
          InputLabelProps={{
            htmlFor: 'subdomain-input',
          }}
          {...register('subdomain')}
          fullWidth
          label="Robo-advisor link"
          error={!!errors.subdomain}
          helperText={errors.subdomain?.message}
        />
      </Box>
      <Typography>.go-bambu.co</Typography>
    </Box>
  );
}

export default ClientExperienceFields;
