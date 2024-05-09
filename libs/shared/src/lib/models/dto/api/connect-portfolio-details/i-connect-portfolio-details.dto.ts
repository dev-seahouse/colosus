import { IConnectPortfolioDetailsProductAllocationDto } from './i-connect-portfolio-details-product-allocation.dto';

export interface IConnectPortfolioDetailsDto {
  id: string;
  key: string;
  name: string;
  description: string;
  expectedReturnPercent: string;
  expectedVolatilityPercent: string;
  products: IConnectPortfolioDetailsProductAllocationDto[];
  riskProfileId: string;
  factSheetLink: string;
}
