import { Button } from '@bambu/react-ui';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';

import { useSelectHasUserCompletedProfileQuery } from '@bambu/go-advisor-core';

import { useNavigate } from 'react-router-dom';

export interface ViewRoboButtonProps {
  label?: string;
}

export function ViewRoboButton({
  label = 'Preview my robo',
}: ViewRoboButtonProps) {
  const { data: userHasCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();

  const navigate = useNavigate();

  const openPreview = () => {
    navigate('/dashboard/preview');
  };

  return (
    <Button
      size="large"
      variant="outlined"
      onClick={openPreview}
      startIcon={userHasCompletedProfile ? <VisibilityIcon /> : <LockIcon />}
      disabled={!userHasCompletedProfile}
    >
      {label}
    </Button>
  );
}

export default ViewRoboButton;
