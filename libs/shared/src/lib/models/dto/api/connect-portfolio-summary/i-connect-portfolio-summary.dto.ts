import { IConnectPortfolioSummaryAssetClassAllocationItemDto } from './i-connect-portfolio-summary-asset-class-allocation.dto';

export interface IConnectPortfolioSummaryDto {
  id?: string | null;
  key: string;
  name: string;
  description: string;
  expectedReturnPercent: string;
  expectedVolatilityPercent: string;
  reviewed: boolean;
  showSummaryStatistics: boolean;
  assetClassAllocation: IConnectPortfolioSummaryAssetClassAllocationItemDto[];
  riskProfileId: string;
}
