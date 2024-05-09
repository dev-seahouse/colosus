import { Stack } from '@bambu/react-ui';
import SchedulingPlatformLinkSectionHeader from './SchedulingPlatformLinkSectionHeader';
import SchedulingPlatformLinkField from './SchedulingPlatformLinkField';

export const SchedulingPlatformLinkSection = () => {
  return (
    <Stack spacing={2}>
      <SchedulingPlatformLinkSectionHeader />
      <SchedulingPlatformLinkField />
    </Stack>
  );
};

export default SchedulingPlatformLinkSection;
