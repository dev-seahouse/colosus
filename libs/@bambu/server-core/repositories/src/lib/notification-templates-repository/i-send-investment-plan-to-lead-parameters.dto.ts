import { ConnectLeadsDto, SharedEnums, TenantBrandingDto } from '@bambu/shared';

export interface ISendInvestmentPlanToLeadParametersDto {
  lead: ConnectLeadsDto.IConnectLeadsItemDto;
  branding: TenantBrandingDto.ITenantBrandingDto;
  portfolioKey: SharedEnums.PortfolioEnums.PortfolioKeyEnum;
  portfolioName: string;
  portfolioDescription: string;
  portfolioExpectedReturn: number;
  portfolioExpectedVolatility: number;
  portfolioAssetDistribution: {
    type: string;
    percentageInInteger: number;
  }[];
}
