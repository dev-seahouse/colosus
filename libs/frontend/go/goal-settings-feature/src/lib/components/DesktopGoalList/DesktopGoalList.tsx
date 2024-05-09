import { Grid } from '@bambu/react-ui';
import { useMemo, useState } from 'react';
import type { GoalType } from '@bambu/go-core';
import { useSelectGoalType } from '@bambu/go-core';

import DesktopGoalCard from '../DesktopGoalCard/DesktopGoalCard';
import { useSelectGoalTypesQuery } from '../../hooks/useGetGoalSettings/useGetGoalSettings.selectors';
import useSelectGoal from '../../hooks/useSelectGoal/useSelectGoal';
import { useGTMSetGoalEvent } from '@bambu/go-analytics';

export function DesktopGoalList() {
  const { data: goalTypes } = useSelectGoalTypesQuery();
  const selectedGoalType = useSelectGoalType();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(
    selectedGoalType
  );
  const length = useMemo(() => goalTypes?.length ?? 0, [goalTypes]);
  const selectGoal = useSelectGoal();
  const gtmSetGoalEvent = useGTMSetGoalEvent();

  const handleSubmit = (goal: GoalType) => {
    setSelectedGoal(goal);
    selectGoal(goal);
    gtmSetGoalEvent({ value: goal });
  };

  return (
    <Grid spacing={7} container>
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="center">
          {goalTypes?.map((goalType) => {
            return (
              <Grid key={goalType.id} item xs={12} md={length === 4 ? 6 : 4}>
                <DesktopGoalCard
                  onClick={() => handleSubmit(goalType.name as GoalType)}
                  selected={selectedGoal === goalType.name}
                  goalType={goalType.name as GoalType}
                  description={goalType.description}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default DesktopGoalList;
