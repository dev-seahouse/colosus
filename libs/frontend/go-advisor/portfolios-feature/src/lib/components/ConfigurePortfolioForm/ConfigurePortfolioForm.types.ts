import type { TransactAssetAllocationItem } from '../TransactAssetAllocationTable/TransactAssetAllocationTable.types';
import type { UploadedFile } from '@bambu/react-ui';

export interface ConfigurePortfolioFormState {
  key: string;
  name: string;
  description: string;
  expectedReturnPercent: string;
  expectedVolatilityPercent: string;
  reviewed: boolean;
  showSummaryStatistics: boolean;
  assetClassAllocation: Array<{
    assetClass: string;
    percentOfPortfolio: string;
    included: boolean;
  }>;
  transact: {
    instruments: Array<TransactAssetAllocationItem>;
    totalWeight?: number;
    rebalancingThreshold?: number;
    factSheet?: UploadedFile & { hasUploaded: boolean };
  };
  riskProfileId: string;
}
