import { useSelectUnfinishedTaskIndexQuery } from '@bambu/go-advisor-core';

import ClientExperienceSection from '../ClientExperienceSection/ClientExperienceSection';
import LivePlatformSection from '../LivePlatformSection/LivePlatformSection';

export function HomePageContent() {
  const hasCompletedAllTasks = useSelectUnfinishedTaskIndexQuery() === -1;

  if (hasCompletedAllTasks) {
    return <LivePlatformSection />;
  }

  return <ClientExperienceSection />;
}

export default HomePageContent;
