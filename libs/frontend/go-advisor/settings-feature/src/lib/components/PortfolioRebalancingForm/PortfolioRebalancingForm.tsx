import { Grid, Stack, Typography } from '@bambu/react-ui';

import SettingsFormCard from '../SettingsForm/SettingsFormCard';
import SettingsFormTitle from '../SettingsForm/SettingsFormTitle';
import RebalancingThresholdDropdownMenu from '../RebalancingThresholdDropdown/RebalancingThresholdDropdown';

export const PortfolioRebalancingForm = () => {
  return (
    <SettingsFormCard data-testid="meeting-scheduler-settings">
      <Grid spacing={3} container>
        <Grid item xs={6}>
          <SettingsFormTitle>Portfolio Rebalancing</SettingsFormTitle>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <RebalancingThresholdDropdownMenu />
            <Typography>
              Threshold-based rebalancing means that your client portfolios will
              be rebalanced back to model when they have drifted above
              threshold.
            </Typography>
            <Typography>
              To set the rebalancing threshold, go to the portfolio setting
              page.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </SettingsFormCard>
  );
};

export default PortfolioRebalancingForm;
