import { useSelectHasUserUploadedDocumentQuery } from '@bambu/go-advisor-core';
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export const RegulatoryAccordionButton = () => {
  const { data: userHasUploadedDocument } =
    useSelectHasUserUploadedDocumentQuery();
  const label = userHasUploadedDocument
    ? 'Edit legal documents'
    : 'Upload legal documents';

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('../content');
  };

  return <Button onClick={handleClick}>{label}</Button>;
};

export default RegulatoryAccordionButton;
