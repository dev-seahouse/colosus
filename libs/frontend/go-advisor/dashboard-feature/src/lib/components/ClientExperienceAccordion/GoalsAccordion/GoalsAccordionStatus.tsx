import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useSelectHasUserCompletedGoalsQuery } from '@bambu/go-advisor-core';

export const GoalsAccordionStatus = () => {
  const { data: hasUserCompletedGoals } = useSelectHasUserCompletedGoalsQuery();

  if (hasUserCompletedGoals) {
    return <CheckCircleIcon color="success" />;
  }

  return null;
};

export default GoalsAccordionStatus;
