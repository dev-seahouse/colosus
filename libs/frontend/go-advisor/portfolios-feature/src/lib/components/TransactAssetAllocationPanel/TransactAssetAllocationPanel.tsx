import type { TabPanelProps } from '@bambu/go-manage-goals-feature';
import { TabPanel } from '@bambu/go-manage-goals-feature';
import { Box, Divider, Grid, Stack, Typography } from '@bambu/react-ui';
import PortfolioSection from '../PortfolioSection/PortfolioSection';
import TransactAssetAllocationTable from '../TransactAssetAllocationTable/TransactAssetAllocationTable';
import { useSelectIsReadyToConfigureTransactPortfolioQuery } from '@bambu/go-advisor-core';
import { TransactAssetAllocationLocked } from '../TransactAssetAllocationLocked/TransactAssetAllocationLocked';
import { TransactAssetAllocationPieChart } from '../TransactAssetAllocationPieChart/TransactAssetAllocationPieChart';
import { TransactAssetAllocationRebalancingThreshold } from '../TransactAssetAllocationRebalancingThreshold/TransactAssetAllocationRebalancingThreshold';
import TransactModelPortfolioFactSheet from '../TransactModelPortfolioFactSheet/TransactModelPortfolioFactSheet';

export function TransactAssetAllocationPanel({
  index,
  value,
  tabsName,
  ...props
}: TabPanelProps) {
  const {
    data: isReadyToConfigureTransactPortfolio,
    isLoading: isLoadingIsReadyToConfigurePortfolio,
  } = useSelectIsReadyToConfigureTransactPortfolioQuery();

  if (isLoadingIsReadyToConfigurePortfolio) {
    return null;
  }

  return (
    <TabPanel index={index} value={value} tabsName={tabsName} {...props}>
      <Box sx={{ px: 1.5, margin: 'auto' }}>
        {isReadyToConfigureTransactPortfolio ? (
          <PortfolioSection title={'Portfolio Products'}>
            <Stack spacing={4}>
              <Typography>
                Use the "Add product" button to search for products to be added
                to your portfolio. You will need to define the weightage of each
                product you add to your portfolio.
              </Typography>
              <TransactAssetAllocationTable />
              <Grid container justifyContent="space-between">
                <Grid item xs={6}>
                  <TransactAssetAllocationPieChart />
                </Grid>
                <Grid item xs={5}>
                  <TransactAssetAllocationRebalancingThreshold />
                </Grid>
              </Grid>
              <Divider />
              <TransactModelPortfolioFactSheet />
            </Stack>
          </PortfolioSection>
        ) : (
          <TransactAssetAllocationLocked />
        )}
      </Box>
    </TabPanel>
  );
}

export default TransactAssetAllocationPanel;
