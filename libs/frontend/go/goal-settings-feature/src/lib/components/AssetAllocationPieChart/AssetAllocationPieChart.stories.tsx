import type { Meta } from '@storybook/react';
import type { AssetAllocationData } from './AssetAllocationPieChart';
import { AssetAllocationPieChart } from './AssetAllocationPieChart';

const Story: Meta<typeof AssetAllocationPieChart> = {
  component: AssetAllocationPieChart,
  title: 'goal-Settings/components/Asset AllocationPie Chart',
};
export default Story;

const sampleData = [
  {
    included: true,
    assetClass: 'Equity',
    percentOfPortfolio: '5',
  },
  {
    included: true,
    assetClass: 'Money Market',
    percentOfPortfolio: '10',
  },
  {
    included: true,
    assetClass: 'Bonds',
    percentOfPortfolio: '70',
  },
  {
    included: true,
    assetClass: 'Other',
    percentOfPortfolio: '5',
  },
  { included: true, assetClass: 'Cash', percentOfPortfolio: '10' },
] satisfies AssetAllocationData[];
export const Primary = {
  args: {
    data: sampleData,
  },
};
