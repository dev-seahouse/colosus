import { Outlet } from 'react-router-dom';
import { Header } from '@bambu/go-core';
import GoalSettingsLayout from '../../layouts/GoalSettingsLayout/GoalSettingsLayout';
import { useSelectGrowMyWealthGoalName } from '../../store/useGoalSettingsStore.selectors';
import type { ReactNode } from 'react';

export interface GrowMyWealthFlowPageProps {
  children?: ReactNode;
}

export function GrowMyWealthFlowPage({
  children = <Outlet />,
}: GrowMyWealthFlowPageProps) {
  const goalName = useSelectGrowMyWealthGoalName();

  return (
    <>
      <Header />
      <GoalSettingsLayout goalType="Growing Wealth" title={goalName}>
        {children}
      </GoalSettingsLayout>
    </>
  );
}

export default GrowMyWealthFlowPage;
