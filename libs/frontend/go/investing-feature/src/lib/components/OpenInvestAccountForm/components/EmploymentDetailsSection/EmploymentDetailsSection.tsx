/* eslint-disable-next-line */
import {
  Accordion,
  Autocomplete,
  CurrencyField,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@bambu/react-ui';
import type {
  OpenInvestAccountFormSectionProps,
  PANEL_ID_TYPE,
} from '../../OpenInvestAccountForm.types';
import {
  EMPLOYMENT_STATUS,
  INDUSTRIES,
  PANEL_ID,
  SOURCE_OF_INCOME,
} from '../../OpenInvestAccountForm.definition';
import OpenInvestAccountAccordionSummary from '../../../OpenInvestAccountAccordionSummary/OpenInvestAccountAccordionSummary';
import OpenInvestAccountAccordionSummaryIcon from '../../../OpenInvestAccountAccordionSummaryIcon/OpenInvestAccountAccordionSummaryIcon';
import type { OpenAccountFormValues } from '../../OpenInvestAccountForm.types';
import { Controller, useFormContext } from 'react-hook-form';
import OpenInvestAccountAccordionDetails from '../../../OpenInvestAccountAccordionDetails/OpenInvestAccountAccordionDetails';
import { formatStrOption } from './EmploymentDetailsSection.utils';

export function EmploymentDetailsSection({
  isExpanded,
  setExpandedPanelId,
}: OpenInvestAccountFormSectionProps) {
  const {
    control,
    formState: { errors, touchedFields },
    setValue,
    getValues,
    watch,
  } = useFormContext<OpenAccountFormValues>();

  const watchedEmploymentStatus = watch('employmentDetails.employmentStatus');

  const handleAccordionChange =
    (panel: PANEL_ID_TYPE) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanelId(isExpanded ? panel : false);
    };

  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleAccordionChange(PANEL_ID.EMPLOYMENT_DETAILS)}
      disableGutters
    >
      <OpenInvestAccountAccordionSummary
        aria-controls={'employment-details-content'}
        id={'employment-details-panel-header'}
        StartIcon={null}
        expandIcon={
          <OpenInvestAccountAccordionSummaryIcon
            hasError={!!errors.employmentDetails}
            isTouched={!!touchedFields.employmentDetails}
          />
        }
      >
        <Typography>Employment details</Typography>
      </OpenInvestAccountAccordionSummary>

      <OpenInvestAccountAccordionDetails>
        <Stack spacing={2}>
          <Controller
            control={control}
            name={'employmentDetails.employmentStatus'}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                label={'Select employment status'}
                error={!!error}
                helperText={error?.message}
                onChange={(e) => {
                  if (isRetiredOrUnemployed(e.target?.value as string)) {
                    setValue('employmentDetails.industry', '');
                  }
                  field.onChange(e.target.value);
                }}
              >
                {EMPLOYMENT_STATUS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatStrOption(status)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <Controller
            name={'employmentDetails.sourceOfWealth'}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                multiple
                limitTags={1}
                {...field}
                onChange={(e, value) => field.onChange(value)}
                defaultValue={[SOURCE_OF_INCOME[0]]}
                options={SOURCE_OF_INCOME}
                getOptionLabel={(option) => formatStrOption(option)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select source of wealth"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name={'employmentDetails.industry'}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                label={'Select industry'}
                error={!!error}
                helperText={error?.message}
                disabled={isRetiredOrUnemployed(watchedEmploymentStatus)}
              >
                {INDUSTRIES.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {formatStrOption(industry)}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="employmentDetails.annualIncome"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CurrencyField
                allowNegative={false}
                label="Annual income"
                placeholder="Enter annual income"
                value={value}
                error={!!error}
                helperText={error?.message}
                onValueChange={(e) => {
                  onChange(e.floatValue);
                }}
              />
            )}
          />
        </Stack>
      </OpenInvestAccountAccordionDetails>
    </Accordion>
  );
}

function isRetiredOrUnemployed(employmentStatus: string) {
  return ['Retired', 'Unemployed'].includes(employmentStatus);
}
export default EmploymentDetailsSection;
