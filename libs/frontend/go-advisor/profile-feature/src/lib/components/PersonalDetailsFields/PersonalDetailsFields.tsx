import { Grid } from '@bambu/react-ui';

import SectionHeading from '../SectionHeading/SectionHeading';
import FirstNameField from '../FirstNameField/FirstNameField';
import LastNameField from '../LastNameField/LastNameField';
import CountryOfResidenceSelect from '../CountryOfResidenceSelect/CountryOfResidenceSelect';
import RegionField from '../RegionField/RegionField';

export function PersonalDetailsFields() {
  return (
    <Grid spacing={3} container>
      <Grid item xs={12}>
        <SectionHeading title="About yourself" />
      </Grid>
      <Grid item xs={12} md={6}>
        <FirstNameField />
      </Grid>
      <Grid item xs={12} md={6}>
        <LastNameField />
      </Grid>
      <Grid item xs={12} md={6}>
        <CountryOfResidenceSelect />
      </Grid>
      <Grid item xs={12} md={6}>
        <RegionField />
      </Grid>
    </Grid>
  );
}

export default PersonalDetailsFields;
