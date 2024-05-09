import { Grid, Typography, Stack, TextField, MuiLink } from '@bambu/react-ui';
import { useFormContext } from 'react-hook-form';

import SettingsFormCard from './SettingsFormCard';
import SettingsFormTitle from './SettingsFormTitle';
import type { SettingsFormState } from './SettingsForm';

export const MeetingSchedulerSettings = () => {
  const { register } = useFormContext<SettingsFormState>();

  return (
    <SettingsFormCard data-testid="meeting-scheduler-settings">
      <Grid spacing={3} container>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <SettingsFormTitle>Meeting scheduler link</SettingsFormTitle>
            <Stack spacing={4}>
              <Typography>
                Let clients schedule an appointment with you, so you don’t have
                to manage your calendar manually.
              </Typography>
              <Typography>
                We recommend using{' '}
                <MuiLink
                  href="https://calendly.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Calendly
                </MuiLink>
                –a free, cloud-based scheduling system that you can set on your
                own.
              </Typography>
              <Typography>
                Once you set it up, copy and paste your meeting link in the
                field provided.
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={2}>
            <TextField
              // {...register('contactLink')}
              inputProps={{
                'data-testid': 'contact-link-input',
                id: 'contact-link-input',
              }}
              InputLabelProps={{
                htmlFor: 'contact-link-input',
              }}
              label="Your calendly public link"
            />
          </Stack>
        </Grid>
      </Grid>
    </SettingsFormCard>
  );
};

export default MeetingSchedulerSettings;
