import { Accordion, useMobileView, AccordionDetails } from '@bambu/react-ui';
import { useState } from 'react';

import GoalTypeSummary from './GoalTypeSummary';
import RetirementGoalForm from './RetirementGoalForm';
export function GoalControllerAccordion() {
  const isMobile = useMobileView();
  const [expanded, setExpanded] = useState(!isMobile);

  const handleExpand = () => setExpanded((prevExpanded) => !prevExpanded);

  return (
    <Accordion expanded={expanded} onChange={handleExpand}>
      <GoalTypeSummary />
      <AccordionDetails>
        <RetirementGoalForm />
      </AccordionDetails>
    </Accordion>
  );
}

export default GoalControllerAccordion;
