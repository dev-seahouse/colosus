import { useSelectLeadsTotalCounts } from '@bambu/go-advisor-core';
import { LEADS_TYPES } from '@bambu/api-client';
import { Card, Box, Grid, Link, Fade } from '@bambu/react-ui';

import LeadStats from './LeadStats';

export const TotalLeadsBanner = () => {
  const { data, isLoading } = useSelectLeadsTotalCounts({
    pageIndex: 0,
    pageSize: 10,
    nameFilter: '',
    qualifiedFilter: LEADS_TYPES.ALL,
  });

  if (isLoading) {
    return null;
  }

  return (
    <Fade in>
      <Card>
        <Box px={3} py={4}>
          <Grid spacing={3} container>
            <Grid item xs={12}>
              <Grid spacing={2} container>
                <Grid item xs={6}>
                  <LeadStats
                    title="Qualified leads"
                    value={data?.QUALIFIED as number}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LeadStats
                    title="Unqualified leads"
                    value={data?.TRANSACT as number}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Link to="../leads">View leads</Link>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Fade>
  );
};

export default TotalLeadsBanner;
