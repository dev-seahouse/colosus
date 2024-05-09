import {
  TextField,
  Stack,
  Divider,
  ColorPicker,
  Typography,
  ImageUpload,
} from '@bambu/react-ui';
import { useFormContext, Controller } from 'react-hook-form';
import { SectionContainer } from '@bambu/go-advisor-core';

import type { BrandingFormState } from '../BrandingForm/BrandingForm';

export function HeaderBranding() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BrandingFormState>();

  return (
    <SectionContainer title="Header">
      <Stack spacing={3}>
        <Stack spacing={2}>
          <TextField
            label="Robo-advisor name"
            inputProps={{
              'data-testid': 'tradeName-input',
              id: 'tradeName-input',
            }}
            InputLabelProps={{
              htmlFor: 'tradeName-input',
            }}
            {...register('tradeName')}
            helperText={errors?.tradeName?.message}
            error={!!errors.tradeName}
          />
          <Controller
            render={({ field: { onChange, value } }) => (
              <ImageUpload
                defaultValue={value && { url: value.url }}
                UploadButtonProps={{ label: 'Show a logo instead' }}
                RemoveButtonProps={{ label: 'Remove logo' }}
                onDrop={onChange}
                onRemove={() => onChange(null)}
                helperText="Choose a JPEG / PNG image with a minimum resolution of 300 x 300px"
              />
            )}
            control={control}
            name="logo"
          />
          <Divider />
        </Stack>
        <Typography>
          Customize the header background color (optional)
        </Typography>
        <Controller
          render={({ field: { value, onChange } }) => (
            <ColorPicker value={value} onChange={onChange} />
          )}
          name="headerBgColor"
          control={control}
        />
      </Stack>
    </SectionContainer>
  );
}

export default HeaderBranding;
