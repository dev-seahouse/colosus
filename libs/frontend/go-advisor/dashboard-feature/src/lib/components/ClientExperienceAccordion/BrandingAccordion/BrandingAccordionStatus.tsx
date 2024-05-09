import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useSelectHasUserCompletedBrandingQuery } from '@bambu/go-advisor-core';

export const BrandingAccordionStatus = () => {
  const { data: hasUserCompletedBranding } =
    useSelectHasUserCompletedBrandingQuery();

  if (hasUserCompletedBranding) {
    return <CheckCircleIcon color="success" />;
  }

  return null;
};

export default BrandingAccordionStatus;
