import {
  Accordion,
  Typography,
  Stack,
  TextField,
  registerMuiField,
  Autocomplete,
  CircularProgress,
} from '@bambu/react-ui';
import type { OpenInvestAccountFormSectionProps } from '../../OpenInvestAccountForm.types';
import type { PANEL_ID_TYPE } from '../../OpenInvestAccountForm.types';
import { PANEL_ID } from '../../OpenInvestAccountForm.definition';
import OpenInvestAccountAccordionSummary from '../../../OpenInvestAccountAccordionSummary/OpenInvestAccountAccordionSummary';
import type { OpenAccountFormValues } from '../../OpenInvestAccountForm.types';
import { Controller, useFormContext } from 'react-hook-form';
import { selectCountryOptions, useGetCountries } from '@bambu/go-core';
import OpenInvestAccountAccordionSummaryIcon from '../../../OpenInvestAccountAccordionSummaryIcon/OpenInvestAccountAccordionSummaryIcon';
import { OpenInvestAccountAccordionDetails } from '../../../OpenInvestAccountAccordionDetails/OpenInvestAccountAccordionDetails';

export function HomeAddressSection({
  isExpanded,
  setExpandedPanelId,
}: OpenInvestAccountFormSectionProps) {
  const { data: countries, isLoading: isCountriesLoading } = useGetCountries<
    ReturnType<typeof selectCountryOptions>
  >({
    select: selectCountryOptions,
  });

  const handleAccordionChange =
    (panel: PANEL_ID_TYPE) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanelId(isExpanded ? panel : false);
    };

  const {
    register,
    control,
    formState: { errors, touchedFields },
  } = useFormContext<OpenAccountFormValues>();

  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleAccordionChange(PANEL_ID.HOME_ADDRESS)}
      disableGutters
    >
      <OpenInvestAccountAccordionSummary
        aria-controls={'home-address-content'}
        id={'home-address-panel-header'}
        StartIcon={null}
        expandIcon={
          <OpenInvestAccountAccordionSummaryIcon
            hasError={!!errors.homeAddress}
            isTouched={!!touchedFields.homeAddress}
          />
        }
      >
        <Typography>Home address</Typography>
      </OpenInvestAccountAccordionSummary>
      <OpenInvestAccountAccordionDetails>
        <Stack spacing={2}>
          <TextField
            label={'Address line 1'}
            placeholder={'Enter address 1'}
            {...registerMuiField(register('homeAddress.line1'))}
            error={!!errors?.homeAddress?.line1}
            helperText={errors?.homeAddress?.line1?.message}
          />

          <TextField
            label={'Address line 2'}
            placeholder={'Enter address 2 (optional)'}
            {...registerMuiField(register('homeAddress.line2'))}
            error={!!errors?.homeAddress?.line2}
            helperText={errors?.homeAddress?.line2?.message}
          />

          <TextField
            label={'Address line 3'}
            placeholder={'Enter address 3 (optional)'}
            {...registerMuiField(register('homeAddress.line3'))}
            error={!!errors?.homeAddress?.line3}
            helperText={errors?.homeAddress?.line3?.message}
          />

          <TextField
            label={'City'}
            placeholder={'Enter city'}
            {...registerMuiField(register('homeAddress.city'))}
            error={!!errors?.homeAddress?.city}
            helperText={errors?.homeAddress?.city?.message}
          />

          <TextField
            label={'Postal code'}
            placeholder={'Enter postal code'}
            {...registerMuiField(register('homeAddress.postalCode'))}
            error={!!errors?.homeAddress?.postalCode}
            helperText={errors?.homeAddress?.postalCode?.message}
          />

          <Controller
            name="homeAddress.countryCodeOption"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                loading={isCountriesLoading}
                {...field}
                onChange={(e, value) => value?.label && field.onChange(value)}
                disabled
                disableClearable
                options={countries ?? []}
                value={field.value.label ? field.value : null!}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !option?.label) return true;
                  return option.value === value.value;
                }}
                getOptionLabel={(option) => {
                  return option.label ?? '';
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={'Country'}
                    placeholder={'Select country'}
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isCountriesLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
        </Stack>
      </OpenInvestAccountAccordionDetails>
    </Accordion>
  );
}

export default HomeAddressSection;
