import PrimaryGoalIcon from '../icons/PrimaryGoalIcon/PrimaryGoalIcon';
import { useSelectGoalType } from '@bambu/go-core';

export const GoalTypeIcon = () => {
  const goalType = useSelectGoalType() ?? 'Other';

  return <PrimaryGoalIcon goalType={goalType} />;
};

export default GoalTypeIcon;
