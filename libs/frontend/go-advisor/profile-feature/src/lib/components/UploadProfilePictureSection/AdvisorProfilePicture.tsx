import { Avatar } from '@bambu/react-ui';
import { useSelectAdvisorInternalProfilePictureQuery } from '@bambu/go-advisor-core';

export const AdvisorProfilePicture = () => {
  const { data: profilePicture } =
    useSelectAdvisorInternalProfilePictureQuery();

  return (
    <Avatar
      sx={{ bgcolor: 'grey.300', color: 'grey.700', width: 96, height: 96 }}
      {...(profilePicture && { src: profilePicture })}
    />
  );
};

export default AdvisorProfilePicture;
