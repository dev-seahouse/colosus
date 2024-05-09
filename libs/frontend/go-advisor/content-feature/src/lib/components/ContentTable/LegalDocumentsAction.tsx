import { useSelectHasUserUploadedDocumentQuery } from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';
import { EditButton, PendingActionButton } from '@bambu/go-advisor-core';

export const LegalDocumentsAction = () => {
  const { data: hasUserUploadedDocument } =
    useSelectHasUserUploadedDocumentQuery();
  const navigate = useNavigate();

  const handleClick = () => navigate('legal-documents');

  if (hasUserUploadedDocument) {
    return <EditButton onClick={handleClick} />;
  }

  return <PendingActionButton onClick={handleClick} />;
};

export default LegalDocumentsAction;
