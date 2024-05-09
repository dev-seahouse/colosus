import { IBrokerageIntegrationListAllBaseResponseDto } from './i-brokerage-integration-list-all-base-response.dto';
import { IBrokerageIntegrationListAllQueryParamsBaseDto } from './i-brokerage-integration-list-all-query-params-base.dto';

export interface IBrokerageIntegrationPartyIdentifierCreationDto {
  type: string;
  value: string;
  issuer: string;
}

export interface IBrokerageIntegrationPartyIdentifierDto
  extends IBrokerageIntegrationPartyIdentifierCreationDto {
  id: string;
}

export interface IBrokerageIntegrationPartyAnnualIncomeDto {
  amount: number;
  currency: string;
}

export enum BrokerageIntegrationPartySourcesOfWealthEnum {
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

export enum BrokerageIntegrationPartyIndustryEnum {
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

export enum BrokerageIntegrationPartyEmploymentStatusEnum {
  FULL_TIME = 'FullTime',
  PART_TIME = 'PartTime',
  SELF_EMPLOYED = 'SelfEmployed',
  UNEMPLOYED = 'Unemployed',
  RETIRED = 'Retired',
  STUDENT = 'Student',
  NOT_WORKING_DUE_TO_ILLNESS_OR_DISABILITY = 'NotWorkingDueToIllnessOrDisability',
  CARER_OR_PARENT = 'CarerOrParent',
}

export interface IBrokerageIntegrationPartyCreationDto {
  type: string;
  title: string;
  forename: string;
  middlename: string | null;
  surname: string;
  previousSurname: string | null;
  countryOfBirth: string | null;
  emailAddress: string;
  telephoneNumber: string;
  dateOfBirth: string;
  dateOfDeath: string | null;
  taxResidencies: string[];
  nationalities: string[];
  employmentStatus: BrokerageIntegrationPartyEmploymentStatusEnum | null;
  industry?: BrokerageIntegrationPartyIndustryEnum;
  sourcesOfWealth: BrokerageIntegrationPartySourcesOfWealthEnum[];
  annualIncome: IBrokerageIntegrationPartyAnnualIncomeDto;
  clientReference: string;
  identifiers: IBrokerageIntegrationPartyIdentifierCreationDto[];
}

export interface IBrokerageIntegrationPartyDto
  extends IBrokerageIntegrationPartyCreationDto {
  identifiers: IBrokerageIntegrationPartyIdentifierDto[];
  addedAt: string;
  version: number;
  id: string;
  tenantId: string;
}

export type IBrokerageIntegrationPartyUpdateDto = Omit<
  IBrokerageIntegrationPartyCreationDto,
  'type' | 'taxResidencies' | 'nationalities' | 'identifiers'
>;

export interface IBrokerageIntegrationListAllPartiesQueryParamsDto
  extends IBrokerageIntegrationListAllQueryParamsBaseDto {
  clientReference?: string;
  emailAddress?: string;
  name?: string;
  organizationType?: string;
  partyType?: string;
  surname?: string;
}

export type IBrokerageIntegrationListAllPartiesResponseDto =
  IBrokerageIntegrationListAllBaseResponseDto<IBrokerageIntegrationPartyDto[]>;
