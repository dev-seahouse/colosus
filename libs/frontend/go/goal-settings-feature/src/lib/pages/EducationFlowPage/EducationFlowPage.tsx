import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

import GoalSettingsLayout from '../../layouts/GoalSettingsLayout/GoalSettingsLayout';
import { useSelectEducationGoalName } from '../../store/useGoalSettingsStore.selectors';
import { Header } from '@bambu/go-core';

export interface EducationFlowPageProps {
  children?: ReactNode;
}

export function EducationFlowPage({
  children = <Outlet />,
}: EducationFlowPageProps) {
  const goalName = useSelectEducationGoalName();

  return (
    <>
      <Header />
      <GoalSettingsLayout goalType="Education" title={goalName}>
        {children}
      </GoalSettingsLayout>
    </>
  );
}

export default EducationFlowPage;
