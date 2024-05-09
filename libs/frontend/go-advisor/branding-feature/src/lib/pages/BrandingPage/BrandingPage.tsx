import { Grid } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';

import BrandingForm from '../../components/BrandingForm/BrandingForm';
export function BrandingPage() {
  return (
    <Grid spacing={4} container>
      <Grid item xs={12}>
        <Heading
          title="Branding"
          subtitle="Personalize your robo-advisor with your own logo and colors"
        />
      </Grid>
      <Grid item xs={12}>
        <BrandingForm />
      </Grid>
    </Grid>
  );
}

export default BrandingPage;
