import { Stack, BackButton, Box } from '@bambu/react-ui';
import { Heading } from '@bambu/go-advisor-core';
import InAppPreview from '../../components/InAppPreview/InAppPreview';
import InAppPreviewUserBanner from '../../components/InAppPreviewUserBanner/InAppPreviewUserBanner';

export function PreviewPage() {
  return (
    <Stack spacing={2}>
      <Box>
        <BackButton label="Dashboard" />
      </Box>
      <Heading
        title="Preview my robo"
        subtitle="See exactly what your clients will see when they engage with your robo-advisor. Click through the preview below to step through your robo journey on both mobile and desktop devices."
      />
      <Stack spacing={4}>
        <InAppPreview />
        <InAppPreviewUserBanner />
      </Stack>
    </Stack>
  );
}

export default PreviewPage;
