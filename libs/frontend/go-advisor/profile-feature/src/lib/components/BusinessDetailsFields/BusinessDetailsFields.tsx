import { Grid } from '@bambu/react-ui';

import SectionHeading from '../SectionHeading/SectionHeading';
import JobTitleField from '../JobTitleField/JobTitleField';
import BusinessNameField from '../BusinessNameField/BusinessNameField';

export function BusinessDetailsFields() {
  return (
    <Grid spacing={3} container>
      <Grid item xs={12}>
        <SectionHeading title="About your business" />
      </Grid>
      <Grid item xs={12} md={6}>
        <JobTitleField />
      </Grid>
      <Grid item xs={12} md={6}>
        <BusinessNameField />
      </Grid>
    </Grid>
  );
}

export default BusinessDetailsFields;
