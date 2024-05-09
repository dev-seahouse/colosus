import { Stack, Paper } from '@bambu/react-ui';
import { useSelectProjectionsQuery } from '../../hooks/useGetOptimizedProjection/useGetOptimizedProjection.selectors';
import GoalProjectionDisclaimer from '../GoalProjectionDisclaimer/GoalProjectionDisclaimer';
import GoalProjectionGraph from '../GoalProjectionGraph/GoalProjectionGraph';
import { Grid, Typography } from '@mui/material';
import { PortfolioSummaryField } from '../PortfolioSummary/PortfolioSummaryField';
import PercentageText from '../PortfolioSummary/PercentageText';
import type { GetModelPortfoliosData } from '@bambu/go-core';
import {
  BoxWithLightenedPrimaryColor,
  useSelectModelPortfolioByRiskProfileId,
  useSelectRiskProfileId,
} from '@bambu/go-core';

type GoalProjectionProps = {
  initialData?: GetModelPortfoliosData;
};

export function GoalProjection({ initialData }: GoalProjectionProps) {
  const riskProfileId = useSelectRiskProfileId();

  if (!riskProfileId) {
    throw new Error('Risk profile id is missing.');
  }
  const { data: modelPortfolio } = useSelectModelPortfolioByRiskProfileId({
    riskProfileId,
    ...(initialData && { initialData }),
  });

  const { data: projections } = useSelectProjectionsQuery();

  if (!projections) {
    return null;
  }

  if (!modelPortfolio) {
    return null;
  }

  return (
    <Paper>
      <Stack spacing={4} p={2}>
        <Typography>Goal Projection</Typography>
        <GoalProjectionGraph data={projections} />
        <BoxWithLightenedPrimaryColor p={1}>
          <Grid item xs={12}>
            <Grid spacing={1} container>
              <Grid item xs={6}>
                <PortfolioSummaryField
                  label="Expected annual return"
                  value={
                    <PercentageText
                      value={Number(modelPortfolio.expectedReturnPercent)}
                    />
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <PortfolioSummaryField
                  label="Expected annual volatility"
                  value={
                    <PercentageText
                      value={Number(modelPortfolio.expectedVolatilityPercent)}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </BoxWithLightenedPrimaryColor>
        <GoalProjectionDisclaimer />
      </Stack>
    </Paper>
  );
}

export default GoalProjection;
