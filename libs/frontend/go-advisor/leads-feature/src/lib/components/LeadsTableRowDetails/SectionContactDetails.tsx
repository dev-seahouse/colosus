import type { CustomRenderFnProps } from './componentFactory';
import { Typography, Grid, Link, Stack } from '@bambu/react-ui';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { byKey } from './utils';

export function SectionContactDetails({
  fields,
  displayName: title,
}: CustomRenderFnProps) {
  const emailField = fields.find(byKey('EMAIL'));
  const phoneField = fields.find(byKey('PHONE_NUMBER'));

  return (
    <Grid item container xs={12} spacing={3} sx={{ pb: 2 }}>
      {/* no xs={'auto'} to cater for long email*/}
      <Grid item>
        <Stack direction="row" sx={{ color: 'primary.main' }} spacing={1}>
          <EmailIcon />
          <Typography>
            <Link to={`mailto:${emailField?.value ?? '-'}`}>
              {emailField?.value ?? '-'}
            </Link>
          </Typography>
        </Stack>
      </Grid>

      <Grid item>
        <Stack direction="row" alignItems="center" spacing={0}>
          <PhoneIcon sx={{ color: 'primary.main' }} />
          <Typography color="primary.main">
            {phoneField?.value ?? '-'}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default SectionContactDetails;
