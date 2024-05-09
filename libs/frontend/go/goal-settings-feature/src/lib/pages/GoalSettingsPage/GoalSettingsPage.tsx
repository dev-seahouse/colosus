import {
  useSelectSetShowBackButton,
  LayoutWithProgress,
  useSelectSetProgress,
} from '@bambu/go-core';
import { useEffect, useCallback } from 'react';
import { Typography, Stack, Box, useMobileView } from '@bambu/react-ui';

import MobileGoalList from '../../components/MobileGoalList/MobileGoalList';
import DesktopGoalList from '../../components/DesktopGoalList/DesktopGoalList';
import type { ConnectInvestorGetGoalTypesResponseDto } from '@bambu/api-client';
import useGetGoalSettings from '../../hooks/useGetGoalSettings/useGetGoalSettings';

export interface GoalSettingsPageProps {
  initialData?: {
    goalSettings: ConnectInvestorGetGoalTypesResponseDto;
  };
}

export function GoalSettingsPage({ initialData }: GoalSettingsPageProps) {
  const { isInitialLoading } = useGetGoalSettings({
    initialData: initialData?.goalSettings,
  });
  const isMobileView = useMobileView();
  const showBackButton = useSelectSetShowBackButton();
  const setProgress = useSelectSetProgress();
  const handleSetGoalSettingsLayout = useCallback(() => {
    showBackButton(true);
    setProgress(50);
  }, [showBackButton, setProgress]);

  useEffect(() => {
    handleSetGoalSettingsLayout();
  }, [handleSetGoalSettingsLayout]);

  return isInitialLoading ? null : (
    <LayoutWithProgress>
      <Stack spacing={3}>
        <Typography variant="h1" textAlign="center" mobiletextalign="left">
          What goal do you have in mind?
        </Typography>
        <Box>{isMobileView ? <MobileGoalList /> : <DesktopGoalList />}</Box>
      </Stack>
    </LayoutWithProgress>
  );
}

export default GoalSettingsPage;
