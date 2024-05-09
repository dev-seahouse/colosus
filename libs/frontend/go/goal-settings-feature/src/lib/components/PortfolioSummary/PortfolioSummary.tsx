import { Grid, Paper, Stack, Typography } from '@bambu/react-ui';
import type { GetModelPortfoliosData } from '@bambu/go-core';
import {
  useSelectModelPortfolioByRiskProfileId,
  useSelectRiskProfileId,
} from '@bambu/go-core';
import { AssetAllocationPieChart } from '../AssetAllocationPieChart/AssetAllocationPieChart';

export interface PortfolioSummaryProps {
  initialData?: GetModelPortfoliosData;
}

export function PortfolioSummary({ initialData }: PortfolioSummaryProps) {
  const riskProfileId = useSelectRiskProfileId();
  if (!riskProfileId) {
    throw new Error('Risk profile id is empty');
  }
  const { data: modelPortfolio } = useSelectModelPortfolioByRiskProfileId({
    riskProfileId,
    ...(initialData && { initialData }),
  });

  if (!modelPortfolio) {
    return null;
  }

  return (
    <Paper>
      <Grid container p={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography fontWeight={500} variant={'body2'}>
                {modelPortfolio.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Typography fontWeight={400}>
                  {modelPortfolio?.description}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <AssetAllocationPieChart data={modelPortfolio.assetClassAllocation} />
      </Grid>
    </Paper>
  );
}

export default PortfolioSummary;
