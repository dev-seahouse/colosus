import type { CustomRenderFnProps } from './componentFactory';
import { byKey, toTitleCase } from './utils';

import { Typography, Grid, Chip } from '@bambu/react-ui';

export function SectionUserDetails({
  fields,
  displayName: title,
}: CustomRenderFnProps) {
  const statusField = fields.find(byKey('STATUS'));
  const nameField = fields.find(byKey('NAME'));
  return (
    <Grid
      item
      container
      xs={12}
      spacing={2}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h1">{nameField?.value ?? '-'}</Typography>
      </Grid>
      <Grid item>
        <Chip
          label={toTitleCase(statusField?.value ?? '-')}
          size="small"
          color="primary"
          sx={{
            backgroundColor: '#BAFFE5',
            color: '#001E2C',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        />
      </Grid>
    </Grid>
  );
}

export default SectionUserDetails;
