import { Stack, Typography } from '@bambu/react-ui';
import type { AssetAllocationData } from '@bambu/go-goal-settings-feature';
import { AssetAllocationPieChart } from '@bambu/go-goal-settings-feature';
import { useFormContext } from 'react-hook-form';
import type { TransactAssetAllocationItem } from '../TransactAssetAllocationTable/TransactAssetAllocationTable.types';
import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';

export function TransactAssetAllocationPieChart() {
  const methods = useFormContext<ConfigurePortfolioFormState>();
  const instruments = methods.watch('transact.instruments');
  const data = mapToAssetAllocationData(instruments);

  return (
    <Stack>
      <Typography variant="subtitle1" fontWeight="bold">
        Asset Allocation
      </Typography>
      <AssetAllocationPieChart variant="circle" data={data} />
    </Stack>
  );
}

function mapToAssetAllocationData(
  data: TransactAssetAllocationItem[]
): AssetAllocationData[] {
  if (!Array.isArray(data)) return [];
  const groupedData: { [key: string]: number } = {};
  data.forEach((item) => {
    if (item.instrumentId === '-') return;
    if (groupedData[item.type]) {
      groupedData[item.type] += item.weightage ?? 0;
    } else {
      groupedData[item.type] = item.weightage ?? 0;
    }
  });

  return Object.entries(groupedData).map(
    ([assetClass, percentOfPortfolio]) => ({
      included: true,
      assetClass,
      percentOfPortfolio: percentOfPortfolio.toString(),
    })
  );
}

export default TransactAssetAllocationPieChart;
