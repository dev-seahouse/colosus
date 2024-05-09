import {
  useSelectHasUserCompletedProfileSummaryQuery,
  EditButton,
  PendingActionButton,
} from '@bambu/go-advisor-core';
import { useNavigate } from 'react-router-dom';

export const ProfileSummaryAction = () => {
  const { data: hasUserCompletedProfileSummary } =
    useSelectHasUserCompletedProfileSummaryQuery();
  const navigate = useNavigate();

  const handleClick = () => navigate('my-profile-summary');

  if (hasUserCompletedProfileSummary) {
    return <EditButton onClick={handleClick} />;
  }

  return <PendingActionButton onClick={handleClick} />;
};

export default ProfileSummaryAction;
