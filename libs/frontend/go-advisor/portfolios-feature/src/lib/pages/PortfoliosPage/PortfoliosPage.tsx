import { Grid } from '@bambu/react-ui';
import { Heading, BackToDashboardBanner } from '@bambu/go-advisor-core';

import useGetConnectPortfolios from '../../hooks/useGetConnectPortfolios/useGetConnectPortfolios';
import type { GetConnectPortfoliosData } from '../../hooks/useGetConnectPortfolios/useGetConnectPortfolios';
import TalkingPoint from '../../components/TalkingPoint/TalkingPoint';
import PortfoliosTable from '../../components/PortfoliosTable/PortfoliosTable';

interface PortfoliosPageInitialData {
  portfolios: GetConnectPortfoliosData;
}

export interface PortfoliosPageProps {
  initialData?: PortfoliosPageInitialData;
}

export function PortfoliosPage({ initialData }: PortfoliosPageProps) {
  const { isInitialLoading } = useGetConnectPortfolios({
    initialData: initialData?.portfolios,
  });

  return isInitialLoading ? null : (
    <Grid spacing={4} container>
      <Grid item xs={12} md={10}>
        <Heading
          title="Portfolios"
          subtitle="Your robo-advisor matches your portfolios to your clients based on their investment style, ensuring they receive personalized financial plans that fit their goals."
        />
      </Grid>
      <Grid item xs={12}>
        <PortfoliosTable />
      </Grid>
      <Grid item xs={12}>
        <BackToDashboardBanner />
      </Grid>
      <Grid item xs={12}>
        <TalkingPoint />
      </Grid>
    </Grid>
  );
}

export default PortfoliosPage;
