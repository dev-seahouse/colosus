import { Chip } from '@bambu/react-ui';
import { useSelectHasUserUploadedDocumentQuery } from '@bambu/go-advisor-core';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const RegulatoryAccordionStatus = () => {
  const { data: userHasUploadedDocument } =
    useSelectHasUserUploadedDocumentQuery();

  if (userHasUploadedDocument) {
    return <CheckCircleIcon color="success" />;
  }

  return null;
};

export default RegulatoryAccordionStatus;
