import { Box } from '@bambu/react-ui';
import AdvisorProfilePicture from './AdvisorProfilePicture';
import UploadProfilePictureButton from './UploadProfilePictureButton';
import RemoveProfilePictureButton from './RemoveProfilePictureButton';

import { useSelectAdvisorHasProfilePictureQuery } from '@bambu/go-advisor-core';

export function UploadProfilePictureSection() {
  const { data: hasProfilePicture } = useSelectAdvisorHasProfilePictureQuery();

  return (
    <Box display="flex" alignItems="center">
      <AdvisorProfilePicture />
      <Box ml={4}>
        {hasProfilePicture ? (
          <RemoveProfilePictureButton />
        ) : (
          <UploadProfilePictureButton />
        )}
      </Box>
    </Box>
  );
}

export default UploadProfilePictureSection;
