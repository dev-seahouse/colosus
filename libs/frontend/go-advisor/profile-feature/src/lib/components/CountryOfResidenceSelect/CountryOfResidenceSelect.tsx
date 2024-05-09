import { MenuItem, Select } from '@bambu/react-ui';
import { Controller, useFormContext } from 'react-hook-form';

import type { ProfileFormState } from '../ProfileForm/ProfileForm';
import type { UpdateProfileFormState } from '../UpdateProfileForm/UpdateProfileForm';

import { COUNTRY_OF_RESIDENCE } from './CountryOfResidenceSelect.constants';

export function CountryOfResidenceSelect() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProfileFormState | UpdateProfileFormState>();
  return (
    <Controller
      control={control}
      render={({ field }) => (
        <Select
          label="Country of residence"
          fullWidth
          {...field}
          error={!!errors.countryOfResidence}
          helperText={errors.countryOfResidence?.message}
        >
          {COUNTRY_OF_RESIDENCE.map((country) => (
            <MenuItem key={country.cca3} value={country.cca3}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      )}
      name="countryOfResidence"
    />
  );
}

export default CountryOfResidenceSelect;
