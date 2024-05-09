import {
  InvestorBrokerageEmploymentStatusEnum,
  InvestorBrokerageSourcesOfWealthEnum,
  InvestorBrokerageIndustryEnum,
} from '@bambu/api-client';

export const PANEL_ID = {
  ACCOUNT_INFO: 'account-info',
  PERSONAL_DETAILS: 'personal-details',
  HOME_ADDRESS: 'home-address',
  CONTACT_DETAILS: 'contact-details',
  EMPLOYMENT_DETAILS: 'employment-details',
} as const;

// TODO: type this from schema to avoid adding/removing fields conflict
export const TITLES: ReadonlyArray<{ label: string; value: string }> = [
  {
    label: 'Mr',
    value: 'Mr',
  },
  {
    label: 'Mrs',
    value: 'Mrs',
  },
  {
    label: 'Miss',
    value: 'Miss',
  },
  {
    label: 'Ms',
    value: 'Ms',
  },
  {
    label: 'Dr',
    value: 'Dr',
  },
  {
    label: 'Prof',
    value: 'Prof',
  },
] as const;

export const EMPLOYMENT_STATUS = [
  InvestorBrokerageEmploymentStatusEnum.FULL_TIME,
  InvestorBrokerageEmploymentStatusEnum.PART_TIME,
  InvestorBrokerageEmploymentStatusEnum.SELF_EMPLOYED,
  InvestorBrokerageEmploymentStatusEnum.UNEMPLOYED,
  InvestorBrokerageEmploymentStatusEnum.RETIRED,
  InvestorBrokerageEmploymentStatusEnum.STUDENT,
  InvestorBrokerageEmploymentStatusEnum.NOT_WORKING_DUE_TO_ILLNESS_OR_DISABILITY,
  InvestorBrokerageEmploymentStatusEnum.CARER_OR_PARENT,
];

export const SOURCE_OF_INCOME = [
  InvestorBrokerageSourcesOfWealthEnum.SALARY,
  InvestorBrokerageSourcesOfWealthEnum.INHERITANCE,
  InvestorBrokerageSourcesOfWealthEnum.GIFT,
  InvestorBrokerageSourcesOfWealthEnum.BUSINESS_OWNERSHIP,
  InvestorBrokerageSourcesOfWealthEnum.SALE_OF_PROPERTY,
  InvestorBrokerageSourcesOfWealthEnum.GAMBLING_OR_LOTTERY,
  InvestorBrokerageSourcesOfWealthEnum.PERSONAL_SAVINGS,
  InvestorBrokerageSourcesOfWealthEnum.LEGAL_SETTLEMENT,
  InvestorBrokerageSourcesOfWealthEnum.SALE_OF_INVESTMENTS,
  InvestorBrokerageSourcesOfWealthEnum.DIVIDEND,
];

export const INDUSTRIES = [
  InvestorBrokerageIndustryEnum.AGRICULTURE_FORESTRY_AND_FISHING,
  InvestorBrokerageIndustryEnum.ARTS_SPORT_AND_CREATIVE,
  InvestorBrokerageIndustryEnum.CONSTRUCTION_AND_ENGINEERING,
  InvestorBrokerageIndustryEnum.CRYPTO_INDUSTRY_AND_CRYPTOCURRENCIES,
  InvestorBrokerageIndustryEnum.CULTURAL_ARTEFACTS,
  InvestorBrokerageIndustryEnum.DATING_OR_ADULT_INDUSTRY,
  InvestorBrokerageIndustryEnum.EDUCATION,
  InvestorBrokerageIndustryEnum.ENERGY_AND_WATER_SUPPLY,
  InvestorBrokerageIndustryEnum.FINANCE_AND_INSURANCE,
  InvestorBrokerageIndustryEnum.GAMBLING_OR_I_GAMING_INDUSTRY,
  InvestorBrokerageIndustryEnum.GOVERNMENT_PUBLIC_SERVICE_AND_DEFENCE,
  InvestorBrokerageIndustryEnum.HEALTH_AND_SOCIAL_WORK,
  InvestorBrokerageIndustryEnum.HOSPITALITY,
  InvestorBrokerageIndustryEnum.IMPORT_EXPORT,
  InvestorBrokerageIndustryEnum.INFORMATION_AND_COMMUNICATION,
  InvestorBrokerageIndustryEnum.LEGAL_AND_REGULATORY,
  InvestorBrokerageIndustryEnum.MANUFACTURING,
  InvestorBrokerageIndustryEnum.MINING,
  InvestorBrokerageIndustryEnum.MONEY_TRANSFER,
  InvestorBrokerageIndustryEnum.MOTOR_TRADES,
  InvestorBrokerageIndustryEnum.PRECIOUS_METALS,
  InvestorBrokerageIndustryEnum.PROPERTY,
  InvestorBrokerageIndustryEnum.RETAIL,
  InvestorBrokerageIndustryEnum.SCIENTIFIC_AND_TECHNICAL,
  InvestorBrokerageIndustryEnum.TOBACCO,
  InvestorBrokerageIndustryEnum.TRANSPORT_AND_STORAGE,
  InvestorBrokerageIndustryEnum.WHOLESALE,
];
