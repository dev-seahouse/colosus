import { Typography, Stack, ColorPicker } from '@bambu/react-ui';
import { useFormContext, Controller } from 'react-hook-form';
import { SectionContainer } from '@bambu/go-advisor-core';

import type { BrandingFormState } from '../BrandingForm/BrandingForm';

export function ColorThemeBranding() {
  const { control } = useFormContext<BrandingFormState>();

  return (
    <SectionContainer title="Color theme">
      <Stack spacing={2}>
        <Typography>
          Select the main brand color to be used in your robo
        </Typography>
        <Controller
          render={({ field: { value, onChange } }) => (
            <ColorPicker value={value} onChange={onChange} />
          )}
          control={control}
          name="brandColor"
        />
      </Stack>
    </SectionContainer>
  );
}

export default ColorThemeBranding;
