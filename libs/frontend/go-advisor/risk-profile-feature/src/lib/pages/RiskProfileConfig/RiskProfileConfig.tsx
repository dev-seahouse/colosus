import { Suspense } from 'react';
import { Box, Grid, Typography } from '@bambu/react-ui';
import { useLoaderData, Await } from 'react-router-dom';
import RiskMeter from '../../components/RiskMeter/RiskMeter';
import NavigateToRiskQuestionnaireBanner from '../../components/NavigateToRiskQuestionnaireBanner/NavigateToRiskQuestionnaireBanner';
import type { GetRiskProfilesData } from '../../hooks/useGetRiskProfiles/useGetRiskProfiles';
import RiskProfilesTable from '../../components/RiskProfilesTable/RiskProfilesTable';

export interface RiskProfileConfigLoaderData {
  riskProfiles: GetRiskProfilesData;
}

export function RiskProfileConfig() {
  const data = useLoaderData() as RiskProfileConfigLoaderData;

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box>
            <Box mb={3}>
              <Typography fontWeight={500} variant="h4">
                Risk Profile Configuration
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                Bambu GO comes with five default risk profiles, sorted from the
                lowest to the highest risk.
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Suspense fallback={null}>
            <Await resolve={data.riskProfiles}>
              {(data: RiskProfileConfigLoaderData['riskProfiles']) => (
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={1}>
                    <RiskMeter />
                  </Grid>
                  <Grid item xs={11}>
                    <RiskProfilesTable initialRiskProfiles={data} />
                  </Grid>
                </Grid>
              )}
            </Await>
          </Suspense>
        </Grid>
        <Grid item xs={12}>
          <NavigateToRiskQuestionnaireBanner />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RiskProfileConfig;
