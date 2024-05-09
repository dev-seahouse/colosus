import { Grid, Select, MenuItem } from '@bambu/react-ui';
import SettingsFormCard from './SettingsFormCard';
import SettingsFormTitle from './SettingsFormTitle';

export const GeneralSettings = () => (
  <SettingsFormCard data-testid="general-settings">
    <Grid spacing={3} container>
      <Grid item xs={6}>
        <SettingsFormTitle>General settings</SettingsFormTitle>
      </Grid>
      <Grid item xs={6}>
        <Select disabled label="Currency" value="default" fullWidth>
          <MenuItem value="default">US Dollars ($)</MenuItem>
        </Select>
      </Grid>
    </Grid>
  </SettingsFormCard>
);

export default GeneralSettings;
