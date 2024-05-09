import {
  Accordion,
  Autocomplete,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  registerMuiField,
  CircularProgress,
} from '@bambu/react-ui';
import OpenInvestAccountAccordionSummary from '../../../OpenInvestAccountAccordionSummary/OpenInvestAccountAccordionSummary';
import { Controller, useFormContext } from 'react-hook-form';
import {
  type OpenAccountFormValues,
  type OpenInvestAccountFormSectionProps,
  type PANEL_ID_TYPE,
} from '../../OpenInvestAccountForm.types';
import type { ChangeEvent } from 'react';
import { PANEL_ID, TITLES } from '../../OpenInvestAccountForm.definition';
import { selectNationalityOptions, useGetCountries } from '@bambu/go-core';
import OpenInvestAccountAccordionSummaryIcon from '../../../OpenInvestAccountAccordionSummaryIcon/OpenInvestAccountAccordionSummaryIcon';
import OpenInvestAccountAccordionDetails from '../../../OpenInvestAccountAccordionDetails/OpenInvestAccountAccordionDetails';

export function PersonalDetailsSection({
  isExpanded,
  setExpandedPanelId,
}: OpenInvestAccountFormSectionProps) {
  const { data: nationalities, isLoading: isNationalitiesLoading } =
    useGetCountries({
      select: selectNationalityOptions,
    });
  const {
    register,
    control,
    formState: { errors, touchedFields },
  } = useFormContext<OpenAccountFormValues>();

  const handleAccordionChange =
    (panel: PANEL_ID_TYPE) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanelId(isExpanded ? panel : false);
    };
  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleAccordionChange(PANEL_ID.PERSONAL_DETAILS)}
      disableGutters
    >
      <OpenInvestAccountAccordionSummary
        aria-controls="personal-details-content"
        id="personal-details-panel-header"
        StartIcon={null}
        expandIcon={
          <OpenInvestAccountAccordionSummaryIcon
            hasError={!!errors.personalDetails}
            isTouched={!!touchedFields.personalDetails}
          />
        }
      >
        <Typography>Personal details</Typography>
      </OpenInvestAccountAccordionSummary>
      <OpenInvestAccountAccordionDetails>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="personalDetails.title"
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                label="Select title"
                error={!!error}
                helperText={error?.message}
                defaultValue="Mr"
              >
                {TITLES.map((title) => (
                  <MenuItem key={title.value} value={title.value}>
                    {title.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <TextField
            label="First name"
            placeholder="Enter first name"
            {...registerMuiField(register('personalDetails.forename'))}
            error={!!errors?.personalDetails?.forename}
            helperText={errors?.personalDetails?.forename?.message}
          />

          <TextField
            label="Middle name (Optional)"
            placeholder="Enter middle name"
            {...registerMuiField(register('personalDetails.middleName'))}
            error={!!errors?.personalDetails?.middleName}
            helperText={errors?.personalDetails?.middleName?.message}
          />

          <TextField
            label="Last name"
            placeholder="Enter last name"
            {...registerMuiField(register('personalDetails.surname'))}
            error={!!errors?.personalDetails?.surname}
            helperText={errors?.personalDetails?.surname?.message}
          />

          <Controller
            name="personalDetails.dateOfBirth"
            render={({ field: { onChange, ...rest } }) => (
              <TextField
                placeholder={'Enter date of birth'}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const inputValue = e.target.value;
                  const formattedValue = formatDateString(inputValue);
                  onChange(formattedValue);
                }}
                {...rest}
                label="Date of birth (DD/MM/YYYY)"
                error={!!errors?.personalDetails?.dateOfBirth}
                helperText={errors?.personalDetails?.dateOfBirth?.message}
              />
            )}
          />

          {/* nationality select */}
          <Controller
            name="personalDetails.nationalitiesOption"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                loading={isNationalitiesLoading}
                onChange={(e, value) => value?.label && field.onChange(value)}
                options={nationalities ?? []}
                value={field.value.label ? field.value : null!}
                disableClearable
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
                    label={'Nationality'}
                    placeholder={'Select Nationality'}
                    error={!!error}
                    helperText={error?.message ?? ''}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isNationalitiesLoading ? (
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

          <TextField
            label="National Insurance Number (NINO)"
            placeholder="Enter NINO"
            {...registerMuiField(register('personalDetails.nino'))}
            error={!!errors?.personalDetails?.nino}
            helperText={errors?.personalDetails?.nino?.message}
          />
        </Stack>
      </OpenInvestAccountAccordionDetails>
    </Accordion>
  );
}

export default PersonalDetailsSection;

// automatically inserts '/' for user as they enters they dob
function formatDateString(inputValue: string): string {
  const formattedValue = inputValue.replace(/\D/g, ''); // Remove all non-digit characters
  if (formattedValue.length <= 2) {
    return formattedValue;
  } else if (formattedValue.length <= 4) {
    return `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
  } else {
    return `${formattedValue.slice(0, 2)}/${formattedValue.slice(
      2,
      4
    )}/${formattedValue.slice(4, 8)}`;
  }
}
