import type { ReactNode } from 'react';
import GoalSettingsLayout from '../../layouts/GoalSettingsLayout/GoalSettingsLayout';
import { useSelectHouseGoalName } from '../../store/useGoalSettingsStore.selectors';
import { Header } from '@bambu/go-core';

export interface HouseFlowPageProps {
  children?: ReactNode;
}

export function HouseFlowPage({ children }: HouseFlowPageProps) {
  const goalName = useSelectHouseGoalName();

  return (
    <>
      <Header />
      <GoalSettingsLayout goalType="House" title={goalName}>
        {children}
      </GoalSettingsLayout>
    </>
  );
}

export default HouseFlowPage;
