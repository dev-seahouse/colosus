import type { Meta } from '@storybook/react';
import { PieChart } from './PieChart';

const Story: Meta<typeof PieChart> = {
  component: PieChart,
  title: 'PieChart',
};
export default Story;

type AssetClass = 'Equity' | 'Bonds' | 'Money Market' | 'Other' | 'Cash';

interface AssetAllocationData {
  included: boolean;
  assetClass: AssetClass;
  percentOfPortfolio: string;
}

function getGraphData(data: AssetAllocationData[]) {
  const COLORS = {
    Equity: '#CEE9DC',
    Bonds: '#80F8D2',
    'Money Market': '#C3E8FE',
    Other: '#344C43',
    Cash: '#8E918F',
  };

  return data
    .filter((x) => x.included === true)
    .map(({ assetClass, percentOfPortfolio }) => ({
      name: assetClass,
      value: Number(percentOfPortfolio),
      color: COLORS[assetClass],
    }));
}

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
    // memo const data = getGraphData(sampleData) to skip re-render in parent
    data: getGraphData(sampleData),
  },
};
