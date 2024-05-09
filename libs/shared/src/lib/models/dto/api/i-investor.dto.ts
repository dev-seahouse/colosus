import { SupportedBrokerageIntegrationEnum } from '../../../enums';

export enum InvestorTypeEnum {
  LEAD = 'LEAD',
  PLATFORM_USER = 'PLATFORM_USER',
  PLATFORM_USER_WITH_INVESTMENT_ACCOUNT = 'PLATFORM_USER_WITH_INVESTMENT_ACCOUNT',
}

export interface IInvestorMutableDto {
  name: string;
  email: string;
  phoneNumber: string;
  zipCode: string | null;
  age: number;
  incomePerAnnum: number | null;
  currentSavings: number | null;
  monthlySavings: number | null;
  isRetired: boolean;
  isEmployed: boolean;
  type: InvestorTypeEnum;
  data: Record<string, unknown> | null;
  tenantId: string;
  leadReviewStatus: string;
}

export interface IInvestorDto extends IInvestorMutableDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface IInvestorPlatformUserMutableDto {
  applicationId: string;
  data: Record<string, unknown> | null;
  investorId: string;
}

export interface IInvestorPlatformUserDto
  extends IInvestorPlatformUserMutableDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface IInvestorPlatformUserAccountMutableDto {
  brokerage: SupportedBrokerageIntegrationEnum;
  partnerAccountId: string;
  partnerAccountNumber: string;
  partnerAccountType: string;
  data: Record<string, unknown> | null;
  investorPlatformUserId: string;
  partnerAccountStatus?: string | null;
}

export interface IInvestorPlatformUserAccountDto
  extends IInvestorPlatformUserAccountMutableDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
