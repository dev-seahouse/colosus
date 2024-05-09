import { useSelectHasUserCompletedContentQuery } from '@bambu/go-advisor-core';
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export const ContentAccordionButton = () => {
  const { data: hasUserCompletedContent } =
    useSelectHasUserCompletedContentQuery();
  const label = hasUserCompletedContent ? 'Edit content' : 'Customize content';

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('../content');
  };

  return <Button onClick={handleClick}>{label}</Button>;
};

export default ContentAccordionButton;
