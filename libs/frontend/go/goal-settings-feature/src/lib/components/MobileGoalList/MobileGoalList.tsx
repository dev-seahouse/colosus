import { useState } from 'react';

import { useGTMSetGoalEvent } from '@bambu/go-analytics';
import type { GoalType } from '@bambu/go-core';
import { useSelectGoalType } from '@bambu/go-core';
import { List } from '@bambu/react-ui';

import {
  useSelectGoalTypesQuery,
} from '../../hooks/useGetGoalSettings/useGetGoalSettings.selectors';
import useSelectGoal from '../../hooks/useSelectGoal/useSelectGoal';
import MobileGoalListItem from '../MobileGoalListItem/MobileGoalListItem';

export function MobileGoalList() {
  const { data: goalTypes } = useSelectGoalTypesQuery();
  const selectedGoalType = useSelectGoalType();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(
    selectedGoalType
  );
  const selectGoal = useSelectGoal();
  const gtmSetGoalEvent = useGTMSetGoalEvent();

  const onClick = (goalType: GoalType) => {
    setSelectedGoal(goalType);
    selectGoal(goalType);
    gtmSetGoalEvent({ value: goalType });
  };

  return (
    <List>
      {goalTypes?.map((goalType) => (
        <MobileGoalListItem
          onClick={onClick}
          key={goalType.id}
          goalType={goalType.name as GoalType}
          description={goalType.description}
          selected={selectedGoal === goalType.name}
        />
      ))}
    </List>
  );
}

export default MobileGoalList;


<Parent >


</Parent>

function Parent({childDAta}) {
<Child childData={childData}></Child>
}
