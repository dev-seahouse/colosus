import { Card, Box, Stack } from '@bambu/react-ui';

import AssetAllocationPieChart from '../AssetAllocationPieChart/AssetAllocationPieChart';
import type { AssetAllocationData } from '../AssetAllocationPieChart/AssetAllocationPieChart';
import PortfolioSummaryV2 from '../PortfolioSummaryV2/PortfolioSummaryV2';

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

export function PortfolioBreakdown() {
  return (
    <Card>
      <Box p={3}>
        <Stack spacing={2}>
          <PortfolioSummaryV2 />
          <AssetAllocationPieChart data={sampleData} />
        </Stack>
      </Box>
    </Card>
  );
}

export default PortfolioBreakdown;
