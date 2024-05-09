export enum InvestorBrokerageEmploymentStatusEnum {
  FULL_TIME = 'FullTime',
  PART_TIME = 'PartTime',
  SELF_EMPLOYED = 'SelfEmployed',
  UNEMPLOYED = 'Unemployed',
  RETIRED = 'Retired',
  STUDENT = 'Student',
  NOT_WORKING_DUE_TO_ILLNESS_OR_DISABILITY = 'NotWorkingDueToIllnessOrDisability',
  CARER_OR_PARENT = 'CarerOrParent',
}

export enum InvestorBrokerageSourcesOfWealthEnum {
  SALARY = 'Salary',
  INHERITANCE = 'Inheritance',
  GIFT = 'Gift',
  BUSINESS_OWNERSHIP = 'BusinessOwnership',
  SALE_OF_PROPERTY = 'SaleOfProperty',
  GAMBLING_OR_LOTTERY = 'GamblingOrLottery',
  PERSONAL_SAVINGS = 'PersonalSavings',
  LEGAL_SETTLEMENT = 'LegalSettlement',
  SALE_OF_INVESTMENTS = 'SaleOfInvestments',
  DIVIDEND = 'Dividend',
}

export enum InvestorBrokerageIndustryEnum {
  AGRICULTURE_FORESTRY_AND_FISHING = 'AgricultureForestryAndFishing',
  ARTS_SPORT_AND_CREATIVE = 'ArtsSportAndCreative',
  CONSTRUCTION_AND_ENGINEERING = 'ConstructionAndEngineering',
  CRYPTO_INDUSTRY_AND_CRYPTOCURRENCIES = 'CryptoIndustryAndCryptocurrencies',
  CULTURAL_ARTEFACTS = 'CulturalArtefacts',
  DATING_OR_ADULT_INDUSTRY = 'DatingOrAdultIndustry',
  EDUCATION = 'Education',
  ENERGY_AND_WATER_SUPPLY = 'EnergyAndWaterSupply',
  FINANCE_AND_INSURANCE = 'FinanceAndInsurance',
  GAMBLING_OR_I_GAMING_INDUSTRY = 'GamblingOrIGamingIndustry',
  GOVERNMENT_PUBLIC_SERVICE_AND_DEFENCE = 'GovernmentPublicServiceAndDefence',
  HEALTH_AND_SOCIAL_WORK = 'HealthAndSocialWork',
  HOSPITALITY = 'Hospitality',
  IMPORT_EXPORT = 'ImportAndExport',
  INFORMATION_AND_COMMUNICATION = 'InformationAndCommunication',
  LEGAL_AND_REGULATORY = 'LegalAndRegulatory',
  MANUFACTURING = 'Manufacturing',
  MINING = 'Mining',
  MONEY_TRANSFER = 'MoneyTransfer',
  MOTOR_TRADES = 'MotorTrades',
  PRECIOUS_METALS = 'PreciousMetals',
  PROPERTY = 'Property',
  RETAIL = 'Retail',
  SCIENTIFIC_AND_TECHNICAL = 'ScientificAndTechnical',
  TOBACCO = 'Tobacco',
  TRANSPORT_AND_STORAGE = 'TransportAndStorage',
  WHOLESALE = 'Wholesale',
}

export enum InvestorBrokerageAccountTypeEnum {
  GIA = 'GIA',
  ISA = 'ISA',
  JISA = 'JISA',
  SIPP = 'SIPP',
}

export enum InvestorBrokerageAccountStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
  CLOSING = 'Closing',
  CLOSED = 'Closed',
}

export enum InvestorBrokerUkDirectDebitMandateStatusEnum {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  CANCELLED = 'Cancelled',
  FAILED = 'Failed',
}

export const ERROR_MESSAGES = {
  NO_ACCOUNTS_FOUND: 'No accounts found for user',
} as const;

export enum InvestorBrokerageUkDirectDebitPaymentStatusEnum {
  PENDING = 'Pending',
  COLLECTING = 'Collecting',
  COLLECTED = 'Collected',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  FAILED = 'Failed',
}
