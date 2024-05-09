import { Stack } from '@bambu/react-ui';
import { Heading, BackToDashboardBanner } from '@bambu/go-advisor-core';
import ContentTable from '../../components/ContentTable/ContentTable';

export function ContentPage() {
  return (
    <Stack spacing={4}>
      <Heading
        title="Content"
        subtitle="These are contents that your clients will see on your robo-advisor"
      />
      <ContentTable />
      <BackToDashboardBanner />
    </Stack>
  );
}

export default ContentPage;
