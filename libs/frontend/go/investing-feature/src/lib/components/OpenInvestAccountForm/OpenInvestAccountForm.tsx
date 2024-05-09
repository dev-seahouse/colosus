import { enqueueSnackbar, Form } from '@bambu/react-ui';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AccountInfoSection from './components/AccountInfoSection/AccountInfoSection';
import { zodResolver } from '@hookform/resolvers/zod';
import { openAccountFormSchema } from './OpenInvestAccountForm.schema';
import {
  type OpenAccountFormValues,
  type PANEL_ID_TYPE,
} from './OpenInvestAccountForm.types';
import { PANEL_ID } from './OpenInvestAccountForm.definition';
import PersonalDetailsSection from './components/PersonalDetailsSection/PersonalDetailsSection';
import HomeAddressSection from './components/HomeAddressSection/HomeAddressSection';
import ContactDetailsSection from './components/ContactDetailsSection/ContactDetailsSection';
import EmploymentDetailsSection from './components/EmploymentDetailsSection/EmploymentDetailsSection';
import { InvestorBrokerageAccountTypeEnum } from '@bambu/api-client';
import { OpenInvestAccountFormActions } from './OpenInvestAccountFormActions';
import { OpenInvestAccountFormUnsavedChangeDialog } from './components/OpenInvestAccountFormUnsavedChangeDialog/OpenInvestAccountFormUnsavedChangeDialog';
import useSubmitKycToBrokerage from '../../hooks/useSubmitKycToBrokerage/useSubmitKycToBrokerage';
import { useNavigate } from 'react-router-dom';

import {
  getBrokerageProfileForInvestorQuery,
  useAppBar,
  useGetInvestorProfile,
} from '@bambu/go-core';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorSnackBar } from './components/ErrorSnackBar/ErrorSnackBar';
import { composeSubmitKycPayload } from './OpenInvestAccountForm.utils';

export function OpenInvestAccountForm() {
  const { show } = useAppBar();
  const queryClient = useQueryClient();
  const { isLoading: isLoadingProfile, data: profileData } =
    useGetInvestorProfile();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<PANEL_ID_TYPE | false>(
    PANEL_ID.ACCOUNT_INFO
  );
  const methods = useForm<OpenAccountFormValues>({
    resolver: zodResolver(openAccountFormSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    values: {
      accountInfo: {
        isUSCitizen: null,
        isUKTaxResident: null,
        accountType: InvestorBrokerageAccountTypeEnum.GIA,
      },
      personalDetails: {
        title: '',
        forename: '',
        surname: '',
        middleName: '',
        dateOfBirth: '',
        nationalitiesOption: { label: '', value: '' },
        nino: '',
      },
      homeAddress: {
        line1: '',
        line2: '',
        line3: '',
        city: '',
        postalCode: '',
        countryCodeOption: { label: 'United Kingdom', value: 'GB' },
      },
      contactDetails: {
        emailAddress: profileData?.email ?? '',
        telephoneNumber: '',
      },
      employmentDetails: {
        annualIncome: null,
        employmentStatus: '',
        sourceOfWealth: [],
        industry: '',
      },
    },
  });

  const { mutate, isLoading } = useSubmitKycToBrokerage({
    onSettled: () => {
      queryClient.invalidateQueries([
        getBrokerageProfileForInvestorQuery.queryKey,
      ]);
    },
    onError: () => {
      enqueueSnackbar(<ErrorSnackBar />, {
        variant: 'long_error',
      });
    },
    onSuccess: () => {
      navigate('/dashboard');
      enqueueSnackbar('KYC successfully submitted.', {
        variant: 'success',
      });
    },
  });
  const onSubmit = methods.handleSubmit((data) => {
    if (!data.accountInfo.isUKTaxResident || data.accountInfo.isUSCitizen) {
      methods.trigger();
      return false;
    }
    const submitKycToBrokerageRequestPayload = composeSubmitKycPayload(data);
    mutate(submitKycToBrokerageRequestPayload);
  });

  return (
    <FormProvider {...methods}>
      {(isLoading || isLoadingProfile) && show()}
      <Form
        id="open-invest-account-form"
        data-testid="open-invest-account-form"
        onSubmit={onSubmit}
      >
        <AccountInfoSection
          isExpanded={expanded === PANEL_ID.ACCOUNT_INFO}
          setExpandedPanelId={setExpanded}
        />

        <PersonalDetailsSection
          isExpanded={expanded === PANEL_ID.PERSONAL_DETAILS}
          setExpandedPanelId={setExpanded}
        />

        <HomeAddressSection
          isExpanded={expanded === PANEL_ID.HOME_ADDRESS}
          setExpandedPanelId={setExpanded}
        />

        <ContactDetailsSection
          isExpanded={expanded === PANEL_ID.CONTACT_DETAILS}
          setExpandedPanelId={setExpanded}
        />

        <EmploymentDetailsSection
          isExpanded={expanded === PANEL_ID.EMPLOYMENT_DETAILS}
          setExpandedPanelId={setExpanded}
        />

        <OpenInvestAccountFormActions isLoading={isLoading} />
        <OpenInvestAccountFormUnsavedChangeDialog
          when={methods.formState.isDirty && !methods.formState.isSubmitted}
        />
      </Form>
    </FormProvider>
  );
}

export default OpenInvestAccountForm;
