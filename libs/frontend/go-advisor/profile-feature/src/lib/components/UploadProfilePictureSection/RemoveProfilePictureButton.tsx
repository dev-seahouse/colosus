import { Button } from '@bambu/react-ui';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelectUpdateProfileDetailsQuery } from '@bambu/go-advisor-core';

import useDeleteAdvisorInternalProfilePicture from '../../hooks/useDeleteAdvisorInternalProfilePicture/useDeleteAdvisorInternalProfilePicture';

export const RemoveProfilePictureButton = () => {
  const updateProfileDetails = useSelectUpdateProfileDetailsQuery();
  const { mutate, isLoading } = useDeleteAdvisorInternalProfilePicture({
    onSuccess: () => updateProfileDetails(),
  });

  return (
    <Button
      isLoading={isLoading}
      onClick={() => mutate()}
      startIcon={<DeleteIcon />}
      variant="text"
      data-testid="remove-profile-picture-btn"
    >
      Remove profile picture
    </Button>
  );
};

export default RemoveProfilePictureButton;
