import { useMemo } from 'react';
import { Box, Grid, PieChart, PieChartLegend } from '@bambu/react-ui';

export interface AssetAllocationPieChartProps {
  data: AssetAllocationData[];
  variant?: string;
}

type AssetClass = 'Equity' | 'Bonds' | 'Money Market' | 'Other' | 'Cash';

export interface AssetAllocationData {
  included?: boolean;
  assetClass: string;
  percentOfPortfolio: string | number;
}

/*
 filters by included = true , note that asset classes with 0% will show up in
 legend but hidden in graph, to hide from legend, filter by percentOfPortfolio > 0
*/
function getGraphData(data: AssetAllocationData[]) {
  const COLORS = {
    Equity: '#CEE9DC',
    Equities: '#CEE9DC',
    Bonds: '#80F8D2',
    'Money Market': '#C3E8FE',
    Other: '#344C43',
    Others: '#C3E8FE',
    Cash: '#8E918F',
  };

  return data
    .filter((x) => x.included === true)
    .map(({ assetClass, percentOfPortfolio }) => ({
      name: assetClass,
      value: Number(percentOfPortfolio),
      color: COLORS[assetClass as AssetClass],
    }));
}

export function AssetAllocationPieChart({
  data,
  variant,
}: AssetAllocationPieChartProps) {
  const piechartData = useMemo(() => getGraphData(data), [data]);
  return (
    <Grid
      container
      justifyContent={'center'}
      alignItems={'center'}
      spacing={{ sm: 0, md: 2 }}
    >
      <Grid item xs={12} md={5}>
        {/* if chart on 'md' is too small, utilize useMedia to change maxHeight */}
        <PieChart data={piechartData} maxHeight={175} />
      </Grid>
      <Grid item xs={12} md={7}>
        <Box px={1}>
          <PieChartLegend
            data={piechartData}
            labels={['Assets', 'Weight']}
            variant={variant}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default AssetAllocationPieChart;
