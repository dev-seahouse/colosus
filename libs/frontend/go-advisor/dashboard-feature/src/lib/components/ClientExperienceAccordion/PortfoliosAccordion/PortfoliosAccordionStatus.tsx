import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useSelectHasUserCompletedPortfoliosQuery } from '@bambu/go-advisor-core';

export const PortfoliosAccordionStatus = () => {
  const { data: hasUserCompletedPortfolios } =
    useSelectHasUserCompletedPortfoliosQuery();

  if (hasUserCompletedPortfolios) {
    return <CheckCircleIcon color="success" />;
  }

  return null;
};

export default PortfoliosAccordionStatus;
