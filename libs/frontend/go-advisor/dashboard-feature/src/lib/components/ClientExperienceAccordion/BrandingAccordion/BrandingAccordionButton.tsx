import { useSelectHasUserCompletedBrandingQuery } from '@bambu/go-advisor-core';
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export const BrandingAccordionButton = () => {
  const { data: hasUserCompletedBranding } =
    useSelectHasUserCompletedBrandingQuery();
  const label = hasUserCompletedBranding
    ? 'Edit Branding'
    : 'Set your branding';

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('../branding');
  };

  return <Button onClick={handleClick}>{label}</Button>;
};

export default BrandingAccordionButton;
