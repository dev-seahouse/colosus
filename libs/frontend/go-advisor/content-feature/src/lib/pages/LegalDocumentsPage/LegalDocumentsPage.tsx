import { BackButton, Grid, Typography } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';

import PrivacyPolicyFileUpload from '../../components/PrivacyPolicyFileUpload/PrivacyPolicyFileUpload';
import TermsAndConditionsFileUpload from '../../components/TermsAndConditionsFileUpload/TermsAndConditionsFileUpload';

export function LegalDocumentsPage() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <BackButton label="All Content" />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Heading
              title="Legal documents"
              subtitle="These are mandatory legal documents that are presented to your clients when they share their contact details and data with you."
            />
          </Grid>
          <Grid item xs={12}>
            <Grid spacing={2} container>
              <Grid item xs={12}>
                <PrivacyPolicyFileUpload />
              </Grid>
              <Grid item xs={12}>
                <TermsAndConditionsFileUpload />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography color="grey.700" variant="subtitle2">
              * This free service is provided by a third-party provider. Bambu
              is not liable for the quality and accuracy of the content it
              provides.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LegalDocumentsPage;
