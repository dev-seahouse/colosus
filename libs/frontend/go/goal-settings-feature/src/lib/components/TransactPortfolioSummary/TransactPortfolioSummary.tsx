import {
  Box,
  Grid,
  lighten,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@bambu/react-ui';
import {
  DataSheetLink,
  useGetInvestorModelPortfolio,
  useSelectModelPortfolioByRiskProfileId,
  useSelectRiskProfileId,
} from '@bambu/go-core';
import { useState } from 'react';
import type { AssetAllocationData } from '../AssetAllocationPieChart/AssetAllocationPieChart';
import AssetAllocationPieChart from '../AssetAllocationPieChart/AssetAllocationPieChart';
import TransactPortfolioSummaryTable from '../TransactPortfolioSummaryTable/TransactPortfolioSummaryTable';

export function TransactPortfolioSummary() {
  const riskProfileId = useSelectRiskProfileId();
  const { data: connectPortfolio } = useSelectModelPortfolioByRiskProfileId({
    riskProfileId: riskProfileId ?? '',
  });
  const { data: modelPortfolio } = useGetInvestorModelPortfolio(
    connectPortfolio?.id ?? '',
    {
      enabled: !!connectPortfolio?.id,
    }
  );
  const [tabValue, setTabTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabTabValue(newValue);
  };

  return (
    <Paper>
      <Grid container p={2} spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={1.8}>
            <Grid item xs={12}>
              <Typography fontWeight={700}>{modelPortfolio?.name}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Typography>{modelPortfolio?.description}</Typography>
                <DataSheetLink
                  name={modelPortfolio?.name}
                  factSheetUrl={modelPortfolio?.factSheetUrl}
                  sx={{ display: 'inline' }}
                />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={(theme) => ({
              borderBottomBorder: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: lighten(theme.palette.primary.main, 0.9),
            })}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              id="portfolio-summary-tabs"
              variant={'fullWidth'}
              data-testid={'portfolio-summary-tabs'}
              sx={{ margin: 'auto' }}
            >
              <Tab
                sx={{ textTransform: 'capitalize' }}
                label={'Assets'}
                {...a11yProps(0)}
              />
              <Tab
                label={'Products'}
                sx={{ textTransform: 'capitalize' }}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <Box
            role={'tabpanel'}
            hidden={tabValue !== 0}
            id={'portfolio-summary-tab-0'}
          >
            <AssetAllocationPieChart
              data={transformData(
                modelPortfolio?.TransactModelPortfolioInstruments ?? []
              )}
            />
          </Box>
          <Box
            role={'tabpanel'}
            hidden={tabValue !== 1}
            id={'portfolio-summary-tab-1'}
          >
            <TransactPortfolioSummaryTable
              connectPortfolioId={connectPortfolio?.id ?? ''}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

function a11yProps(index: number) {
  return {
    id: `portfolio-summary-tab-${index}`,
    'aria-controls': `portfolio-summary-tabpanel-${index}`,
  };
}

function transformData(data: unknown): AssetAllocationData[] {
  if (!Array.isArray(data)) {
    return [];
  }
  const groupedData: { [key: string]: number } = {};

  data.forEach((item) => {
    const assetClass = item.Instrument.InstrumentAssetClass.name;
    const percentOfPortfolio = item.weightage;

    if (groupedData[assetClass]) {
      groupedData[assetClass] += percentOfPortfolio;
    } else {
      groupedData[assetClass] = percentOfPortfolio;
    }
  });

  return Object.entries(groupedData).map(([assetClass, percentOfPortfolio]) => {
    return {
      included: true,
      assetClass,
      percentOfPortfolio: Math.round(percentOfPortfolio * 100),
    };
  });
}

export default TransactPortfolioSummary;
