import { Box, Tabs, Tab, Paper, Grid, Typography } from '@bambu/react-ui';

import { GoAppPreviewCard } from '@bambu/go-advisor-core';
import { Header } from '@bambu/go-core';
import {
  PortfolioSummaryField,
  AssetAllocation,
  PercentageText,
} from '@bambu/go-goal-settings-feature';
import { useFormContext } from 'react-hook-form';

import type { ConfigurePortfolioFormState } from '../ConfigurePortfolioForm/ConfigurePortfolioForm.types';

/**
 * NOTE: have to reconstruct this from atomic components cause there's an issue with the main component
 * main component utilises data from main GET list API instead of specific item, the immutability is hell
 * @constructor
 */
export function PortfolioPreview() {
  const { watch } = useFormContext<ConfigurePortfolioFormState>();
  const name = watch('name');
  const description = watch('description');
  const expectedReturnPercent = watch('expectedReturnPercent');
  const expectedVolatilityPercent = watch('expectedVolatilityPercent');
  const assetClassAllocation = watch('assetClassAllocation');

  return (
    <GoAppPreviewCard>
      <Header />
      <Box sx={{ flexGrow: 1, background: 'rgba(0, 0, 0, 0.5)' }} />
      <Paper square>
        <Tabs variant="fullWidth" value={1}>
          <Tab label="Projection" />
          <Tab label="Portfolio" />
        </Tabs>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography fontWeight={700}>{name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>{description}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid spacing={1} container>
                <Grid item xs={6}>
                  <PortfolioSummaryField
                    label="Expected return"
                    value={
                      <PercentageText value={Number(expectedReturnPercent)} />
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <PortfolioSummaryField
                    label="Expected volatility"
                    value={
                      <PercentageText
                        value={Number(expectedVolatilityPercent)}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <PortfolioSummaryField
                label="Asset allocation"
                value={<AssetAllocation assets={assetClassAllocation} />}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </GoAppPreviewCard>
  );
}

export default PortfolioPreview;
