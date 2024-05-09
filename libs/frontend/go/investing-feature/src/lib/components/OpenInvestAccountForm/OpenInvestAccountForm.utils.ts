import { DateTime } from 'luxon';

import type {
  InvestorBrokerageAccountTypeEnum,
  InvestorBrokerageEmploymentStatusEnum,
  InvestorBrokerageIndustryEnum,
  InvestorBrokerageSourcesOfWealthEnum,
} from '@bambu/api-client';
import { type InvestorBrokerageApiRequestDto } from '@bambu/api-client';

import type { OpenAccountFormValues } from './OpenInvestAccountForm.types';

export function composeSubmitKycPayload(formData: OpenAccountFormValues) {
  const payload = {
    party: {
      type: 'Person',
      identifiers: [
        {
          issuer: 'GB',
          type: 'NINO',
          value: formData.personalDetails.nino.toUpperCase(),
        },
      ],
      countryOfBirth: null,
      dateOfDeath: null,
      title: formData.personalDetails.title,
      forename: formData.personalDetails.forename,
      middlename: formData.personalDetails.middleName ?? null,
      surname: formData.personalDetails.surname,
      previousSurname: null,
      emailAddress: formData.contactDetails.emailAddress,
      telephoneNumber: formData.contactDetails.telephoneNumber,
      dateOfBirth: DateTime.fromFormat(
        formData.personalDetails.dateOfBirth,
        'dd/MM/yyyy',
        { zone: 'utc' }
      ).toISODate(),
      taxResidencies: ['GB'],
      nationalities: [formData.personalDetails.nationalitiesOption.value],
      employmentStatus: formData.employmentDetails
        .employmentStatus as InvestorBrokerageEmploymentStatusEnum,
      industry: formData.employmentDetails
        .industry as InvestorBrokerageIndustryEnum,
      sourcesOfWealth: formData.employmentDetails
        .sourceOfWealth as InvestorBrokerageSourcesOfWealthEnum[],
      annualIncome: {
        currency: 'GBP',
        amount: formData.employmentDetails.annualIncome ?? 0,
      },
    },
    address: {
      line1: formData.homeAddress.line1,
      line2: formData.homeAddress.line2,
      line3: formData.homeAddress.line3,
      city: formData.homeAddress.city,
      region: null,
      postalCode: formData.homeAddress.postalCode,
      countryCode: formData.homeAddress.countryCodeOption.value,
      startDate: null,
      endDate: null,
    },
    account: {
      type: formData.accountInfo
        .accountType as InvestorBrokerageAccountTypeEnum,
      productId: 'prd-gia',
    },
  } satisfies InvestorBrokerageApiRequestDto;
  return payload;
}

export function isValidNINO(nino: string) {
  // Regular expression for validating NINO format (case-insensitive)
  const ninoRegex =
    /^[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z](?!O)[0-9]{6}[ABCD]?$/i;
  // Regular expression for disallowed prefix combinations
  const disallowedPrefixRegex = /^(BG|GB|NK|KN|TN|NT|ZZ)/i;

  return (
    ninoRegex.test(nino) && !disallowedPrefixRegex.test(nino.substring(0, 2))
  );
}
