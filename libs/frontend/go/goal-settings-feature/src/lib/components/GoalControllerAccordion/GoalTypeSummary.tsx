import ExpandMore from '@mui/icons-material/ExpandMore';
import { AccordionSummary } from '@bambu/react-ui';
import type { AccordionSummaryProps } from '@bambu/react-ui';

import GoalTypeIcon from './GoalTypeIcon';
import { useSelectGoalName } from '@bambu/go-core';

export const GoalTypeSummary = () => {
  const goalName = useSelectGoalName() ?? '-';

  return (
    <AccordionSummary
      expandIcon={<ExpandMore />}
      aria-controls="goal-controller-content"
      id="goal-controller-header"
      StartIcon={GoalTypeIcon as unknown as AccordionSummaryProps['StartIcon']}
    >
      {goalName} summary
    </AccordionSummary>
  );
};

export default GoalTypeSummary;
