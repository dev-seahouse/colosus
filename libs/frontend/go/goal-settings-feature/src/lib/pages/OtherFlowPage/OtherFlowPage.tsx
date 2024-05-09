import { Header } from '@bambu/go-core';
import type { ReactNode } from 'react';

import GoalSettingsLayout from '../../layouts/GoalSettingsLayout/GoalSettingsLayout';
import { useSelectOtherGoalName } from '../../store/useGoalSettingsStore.selectors';

export interface OtherFlowPageProps {
  children?: ReactNode;
}

export function OtherFlowPage({ children }: OtherFlowPageProps) {
  const goalName = useSelectOtherGoalName();

  return (
    <>
      <Header />
      <GoalSettingsLayout title={goalName}>{children}</GoalSettingsLayout>
    </>
  );
}

export default OtherFlowPage;
