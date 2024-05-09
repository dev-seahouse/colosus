/* eslint-disable-next-line */
import { Accordion, Stack, TextField, Typography } from '@bambu/react-ui';
import { PANEL_ID } from '../../OpenInvestAccountForm.definition';
import type {
  OpenInvestAccountFormSectionProps,
  PANEL_ID_TYPE,
} from '../../OpenInvestAccountForm.types';
import OpenInvestAccountAccordionSummary from '../../../OpenInvestAccountAccordionSummary/OpenInvestAccountAccordionSummary';
import type { OpenAccountFormValues } from '../../OpenInvestAccountForm.types';
import { Controller, useFormContext } from 'react-hook-form';
import OpenInvestAccountAccordionSummaryIcon from '../../../OpenInvestAccountAccordionSummaryIcon/OpenInvestAccountAccordionSummaryIcon';
import { MuiTelInput } from 'mui-tel-input';
import OpenInvestAccountAccordionDetails from '../../../OpenInvestAccountAccordionDetails/OpenInvestAccountAccordionDetails';

export function ContactDetailsSection({
  isExpanded,
  setExpandedPanelId,
}: OpenInvestAccountFormSectionProps) {
  const {
    control,
    watch,
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
      onChange={handleAccordionChange(PANEL_ID.CONTACT_DETAILS)}
      disableGutters
    >
      <OpenInvestAccountAccordionSummary
        aria-controls={'contact-details-content'}
        id={'contact-details-panel-header'}
        StartIcon={null}
        expandIcon={
          <OpenInvestAccountAccordionSummaryIcon
            hasError={!!errors.contactDetails}
            isTouched={!!touchedFields.contactDetails}
          />
        }
      >
        <Typography>Contact details</Typography>
      </OpenInvestAccountAccordionSummary>
      <OpenInvestAccountAccordionDetails>
        <Stack spacing={2}>
          <Controller
            name={'contactDetails.emailAddress'}
            render={({ field, fieldState: { error } }) => (
              <TextField
                label="Email address"
                disabled
                placeholder={'Enter email address'}
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={'contactDetails.telephoneNumber'}
            render={({ field }) => (
              <MuiTelInput
                inputProps={{
                  'data-testid': 'phone-input',
                  id: 'phone-input',
                  maxLength: 15,
                }}
                InputLabelProps={{
                  htmlFor: 'phone-input',
                }}
                defaultCountry="GB"
                label="Phone number"
                placeholder="Enter phone number"
                error={!!errors.contactDetails?.telephoneNumber}
                helperText={errors.contactDetails?.telephoneNumber?.message}
                {...field}
              />
            )}
          />
        </Stack>
      </OpenInvestAccountAccordionDetails>
    </Accordion>
  );
}

export default ContactDetailsSection;
