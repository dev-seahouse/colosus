import { useSelectHasUserCompletedGoalsQuery } from '@bambu/go-advisor-core';
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export const GoalsAccordionButton = () => {
  const { data: hasUserCompletedGoals } = useSelectHasUserCompletedGoalsQuery();
  const label = hasUserCompletedGoals ? 'Edit goals' : 'Manage goals';

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('../goals');
  };

  return <Button onClick={handleClick}>{label}</Button>;
};

export default GoalsAccordionButton;
