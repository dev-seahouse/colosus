import { Grid, BackButton, Card, CardContent } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';
import { useParams } from 'react-router-dom';
import ConfigurePortfolioForm from '../../components/ConfigurePortfolioForm/ConfigurePortfolioForm';

import PortfolioInfo from '../../components/PortfolioInfo/PortfolioInfo';
import PortfolioDetails from '../../components/PortfolioDetails/PortfolioDetails';
import AssetAllocationTabs from '../../components/AssetAllocationTabs/AssetAllocationTabs';
import {
  useGetConnectPortfolioByKey,
  type GetConnectPortfolioByKeyData,
} from '../../hooks/useGetConnectPortfolioByKey/useGetConnectPortfolioByKey';

interface ConfigurePortfolioPageInitialData {
  portfolio: GetConnectPortfolioByKeyData;
}

export interface ConfigurePortfolioPageProps {
  initialData?: ConfigurePortfolioPageInitialData;
}

export function ConfigurePortfolioPage({
  initialData,
}: ConfigurePortfolioPageProps) {
  const params = useParams();

  const { isInitialLoading } = useGetConnectPortfolioByKey({
    initialData: initialData?.portfolio,
    key: params.portfolioType as string,
  });

  return isInitialLoading ? null : (
    <Grid spacing={2} container>
      <Grid item xs={12}>
        <BackButton label="All Portfolios" />
      </Grid>
      <Grid item xs={12}>
        <Heading title="Configure Portfolio" />
      </Grid>
      <Grid item xs={12}>
        <ConfigurePortfolioForm>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <PortfolioInfo />
                </Grid>
                <Grid item xs={12}>
                  <PortfolioDetails />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 4 }}>
              <AssetAllocationTabs />
            </CardContent>
          </Card>
        </ConfigurePortfolioForm>
      </Grid>
    </Grid>
  );
}

export default ConfigurePortfolioPage;
