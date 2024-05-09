import {
  useSelectIsReadyForPreviewQuery,
  useSelectUnfinishedTaskIndexQuery,
  useSelectUserReadyToSubscribe,
} from '@bambu/go-advisor-core';

import NewUserBanner from './NewUserBanner';
import ReadyForPreviewBanner from './ReadyForPreviewBanner';
import ReadyToShareBanner from './ReadyToShareBanner';
import ReadyToSubscribeBanner from './ReadyToSubscribeBanner';

export function UserProgressBanner() {
  const isReadyForPreview = useSelectIsReadyForPreviewQuery();
  const isReadyToShare = useSelectUnfinishedTaskIndexQuery() === -1;
  const isReadyToSubscribe = useSelectUserReadyToSubscribe();

  if (isReadyToShare) {
    // user completed all onboarding steps
    return <ReadyToShareBanner />;
  }

  if (isReadyForPreview) {
    // user completed branding and profile
    return <ReadyForPreviewBanner />;
  }

  //
  if (isReadyToSubscribe) {
    return <ReadyToSubscribeBanner />;
  }

  return <NewUserBanner />;
}

export default UserProgressBanner;
