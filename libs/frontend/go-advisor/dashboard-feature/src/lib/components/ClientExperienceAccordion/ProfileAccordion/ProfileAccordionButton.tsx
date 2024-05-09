import { useSelectHasUserCompletedProfileQuery } from '@bambu/go-advisor-core';
import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export const ProfileAccordionButton = () => {
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();
  const label = hasUserCompletedProfile ? 'Edit Profile' : 'Complete Profile';

  const navigate = useNavigate();

  const handleClick = () => {
    const to = hasUserCompletedProfile
      ? '../manage-profile'
      : '/onboarding/advisor-details';

    navigate(to);
  };

  return <Button onClick={handleClick}>{label}</Button>;
};

export default ProfileAccordionButton;
