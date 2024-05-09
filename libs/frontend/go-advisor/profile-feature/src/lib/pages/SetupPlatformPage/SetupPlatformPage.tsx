import { useEffect, useCallback } from 'react';
import PlatformSetupForm from '../../components/PlatformSetupForm/PlatformSetupForm';
import {
  useSelectSetOnboardingProgress,
  useSelectSetShowBackButton,
} from '../../store/useProfileCreationStore.selectors';

export function SetupPlatformPage() {
  const setOnboardingProgress = useSelectSetOnboardingProgress();
  const setShowBackButton = useSelectSetShowBackButton();
  const handleSetSetupPlatformPageLayout = useCallback(() => {
    setOnboardingProgress(75);
    setShowBackButton(true);
  }, [setOnboardingProgress, setShowBackButton]);

  useEffect(() => {
    handleSetSetupPlatformPageLayout();
  }, [handleSetSetupPlatformPageLayout]);

  return <PlatformSetupForm />;
}

export default SetupPlatformPage;
