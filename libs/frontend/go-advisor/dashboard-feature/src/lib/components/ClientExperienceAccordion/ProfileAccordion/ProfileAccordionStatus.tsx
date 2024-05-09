import { Chip } from '@bambu/react-ui';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useSelectHasUserCompletedProfileQuery } from '@bambu/go-advisor-core';

export const ProfileAccordionStatus = () => {
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();

  if (hasUserCompletedProfile) {
    return <CheckCircleIcon color="success" />;
  }

  return null;
};

export default ProfileAccordionStatus;
