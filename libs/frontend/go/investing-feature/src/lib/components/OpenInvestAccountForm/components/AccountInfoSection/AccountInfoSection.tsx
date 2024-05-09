import {
  Accordion,
  Button,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@bambu/react-ui';

import OpenInvestAccountAccordionSummary from '../../../OpenInvestAccountAccordionSummary/OpenInvestAccountAccordionSummary';
import RHFRadioGroupControl from '../../../RHFRadioGroupControl/RHFRadioGroupControl';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useState } from 'react';
import {
  type OpenAccountFormValues,
  type OpenInvestAccountFormSectionProps,
  type PANEL_ID_TYPE,
} from '../../OpenInvestAccountForm.types';
import { PANEL_ID } from '../../OpenInvestAccountForm.definition';
import OpenInvestAccountAccordionSummaryIcon from '../../../OpenInvestAccountAccordionSummaryIcon/OpenInvestAccountAccordionSummaryIcon';
import GIABenefitsDialog from '../../../GIABenefitsDialog/GIABenefitsDialog';
import { InvestorBrokerageAccountTypeEnum } from '@bambu/api-client';
import OpenInvestAccountAccordionDetails from '../../../OpenInvestAccountAccordionDetails/OpenInvestAccountAccordionDetails';
import { OpenAccountFormFieldCallout } from '../../../OpenAccountFormFieldCallout/OpenAccountFormFieldCallout';

const yesOrNoRadios = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export function AccountInfoSection({
  isExpanded,
  setExpandedPanelId,
}: OpenInvestAccountFormSectionProps) {
  const {
    control,
    watch,
    formState: { errors, touchedFields },
  } = useFormContext<OpenAccountFormValues>();

  const [isNonUkTaxResident, setIsNonUkTaxResident] = useState<
    boolean | null
  >();
  const [isUSResident, setIsUSResident] = useState<boolean | null>();

  const handleAccordionChange =
    (panel: PANEL_ID_TYPE) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanelId(isExpanded ? panel : false);
    };
  const watchedAccountType = watch('accountInfo.accountType');
  const [giaBenefitsOpen, setGiaBenefitsOpen] = React.useState(false);

  return (
    <Accordion
      expanded={isExpanded}
      onChange={handleAccordionChange(PANEL_ID.ACCOUNT_INFO)}
      disableGutters
    >
      <OpenInvestAccountAccordionSummary
        aria-controls="account-info-content"
        id="account-info-panel-header"
        StartIcon={null}
        expandIcon={
          <OpenInvestAccountAccordionSummaryIcon
            hasError={
              !!errors.accountInfo || !!isNonUkTaxResident || !!isUSResident
            }
            isTouched={!!touchedFields.accountInfo}
          />
        }
      >
        <Typography>Account info</Typography>
      </OpenInvestAccountAccordionSummary>

      <OpenInvestAccountAccordionDetails sx={{ paddingBottom: '10px' }}>
        <Stack spacing={2}>
          <RHFRadioGroupControl
            onChange={(e) => {
              setIsUSResident(e.target.value === 'true');
            }}
            label={
              <Typography color="black" variant={'body2'} fontWeight="bold">
                Are you a U.S. Citizen or Resident currently residing in the
                U.S.?
              </Typography>
            }
            control={control}
            name="accountInfo.isUSCitizen"
            radios={yesOrNoRadios}
          />
          <OpenAccountFormFieldCallout isShown={isUSResident}>
            We are sorry! We are unable to proceed with your account opening.
            This platform is currently not available to U.S citizens and
            residents.
          </OpenAccountFormFieldCallout>
          <RHFRadioGroupControl
            onChange={(e) => {
              setIsNonUkTaxResident(e.target.value === 'false');
            }}
            label={
              <Typography color="black" variant={'body2'} fontWeight="bold">
                Are you a UK tax resident?
              </Typography>
            }
            control={control}
            name="accountInfo.isUKTaxResident"
            radios={yesOrNoRadios}
          />
          <OpenAccountFormFieldCallout isShown={isNonUkTaxResident}>
            We are sorry! We are unable to proceed with your account opening.
            This platform is only available to UK tax resident at the moment.
          </OpenAccountFormFieldCallout>
          <Stack spacing={0.1}>
            <Controller
              control={control}
              name="accountInfo.accountType"
              render={({ field, fieldState: { error } }) => (
                <Select
                  label="Select account type"
                  {...field}
                  disabled
                  error={!!error}
                  helperText={error?.message}
                >
                  <MenuItem
                    key="GIA"
                    value={InvestorBrokerageAccountTypeEnum.GIA}
                  >
                    General Investment Account (GIA)
                  </MenuItem>
                </Select>
              )}
            />
            {watchedAccountType === InvestorBrokerageAccountTypeEnum.GIA && (
              <Button
                variant={'text'}
                type={'button'}
                sx={{
                  justifyContent: 'flex-start',
                  '&:hover': {
                    textDecoration: 'underline',
                    background: 'transparent',
                  },
                }}
                onClick={() => setGiaBenefitsOpen(true)}
                disableRipple
              >
                <Typography fontSize={'12px'}>View GIA benefits</Typography>
              </Button>
            )}
          </Stack>
        </Stack>
      </OpenInvestAccountAccordionDetails>
      <GIABenefitsDialog
        onClose={() => setGiaBenefitsOpen(false)}
        open={giaBenefitsOpen}
      />
    </Accordion>
  );
}

export default AccountInfoSection;
