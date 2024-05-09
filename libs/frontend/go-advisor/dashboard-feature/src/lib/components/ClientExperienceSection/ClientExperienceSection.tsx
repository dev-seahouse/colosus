import { Card, Stack, Typography, Box } from '@bambu/react-ui';

import ClientExperienceAccordion from '../ClientExperienceAccordion/ClientExperienceAccordion';
// import { useFeatureFlag } from '@harnessio/ff-react-client-sdk';

export function ClientExperienceSection() {
  // const isSettingsEnabled = useFeatureFlag('feature_settings');

  return (
    <Card>
      <Stack spacing={4} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Go from zero-to-robo in 7 steps
        </Typography>
        <Box>
          <ClientExperienceAccordion />
        </Box>
      </Stack>
    </Card>
  );
}

export default ClientExperienceSection;
