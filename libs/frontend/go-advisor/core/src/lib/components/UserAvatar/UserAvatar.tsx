import AccountCircle from '@mui/icons-material/AccountCircle';
import { Avatar } from '@bambu/react-ui';
import {
  useSelectHasUserCompletedProfileQuery,
  useSelectAdvisorInitialsQuery,
  useSelectAdvisorInternalProfilePictureQuery,
} from '../../hooks/useProfileDetails/useProfileDetails.selectors';

export function UserAvatar() {
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();
  const { data: advisorInitials } = useSelectAdvisorInitialsQuery();
  const { data: advisorProfilePicture } =
    useSelectAdvisorInternalProfilePictureQuery();

  if (!hasUserCompletedProfile) {
    return <AccountCircle data-testid="profile-icon" />;
  }

  if (advisorProfilePicture) {
    return (
      <Avatar
        data-testid="advisor-profile-picture"
        sx={{ bgcolor: 'grey.300', fontSize: '1rem !important' }}
        src={advisorProfilePicture}
      />
    );
  }

  // !important because it's overriden by MuiButton-endIcon otherwise
  return (
    <Avatar sx={{ fontSize: '1rem !important' }} data-testid="advisor-initials">
      {advisorInitials}
    </Avatar>
  );
}

export default UserAvatar;
