export class ConnectPortfolioSummaryMutable {
  tenantId: string;
  key: string;
  name: string;
  description: string;
  sortKey: number;
  expectedReturnPercent: number;
  expectedVolatilityPercent: number;
  showSummaryStatistics: boolean;
  reviewed: boolean;
  // eslint-disable-next-line
  assetClassAllocation: Record<string, any>;
}

export class ConnectPortfolioSummary extends ConnectPortfolioSummaryMutable {
  id: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
}
