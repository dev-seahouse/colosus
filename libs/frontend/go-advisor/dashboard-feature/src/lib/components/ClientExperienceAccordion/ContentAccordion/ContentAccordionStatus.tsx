import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useSelectHasUserCompletedContentQuery } from '@bambu/go-advisor-core';

export const ContentAccordionStatus = () => {
  const { data: hasUserCompletedContent } =
    useSelectHasUserCompletedContentQuery();

  if (hasUserCompletedContent) {
    return <CheckCircleIcon color="success" />;
  }

  return null;
};

export default ContentAccordionStatus;
