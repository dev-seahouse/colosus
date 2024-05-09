import { useSelectHasUserCompletedPortfoliosQuery } from '@bambu/go-advisor-core';
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export const PortfoliosAccordionButton = () => {
  const { data: hasUserCompletedPortfolios } =
    useSelectHasUserCompletedPortfoliosQuery();
  const label = hasUserCompletedPortfolios
    ? 'Edit portfolios'
    : 'Configure portfolios';

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('../portfolios');
  };

  return <Button onClick={handleClick}>{label}</Button>;
};

export default PortfoliosAccordionButton;
