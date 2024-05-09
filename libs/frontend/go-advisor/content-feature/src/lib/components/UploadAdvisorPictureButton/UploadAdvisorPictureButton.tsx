import { Button, Avatar, Box } from '@bambu/react-ui';
import PersonIcon from '@mui/icons-material/Person';
import { useDropzone } from 'react-dropzone';
import {
  useSelectUpdateProfileDetailsQuery,
  useSelectAdvisorPublicProfilePictureQuery,
} from '@bambu/go-advisor-core';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import DeleteIcon from '@mui/icons-material/Delete';

import useUploadAdvisorPublicProfilePicture from '../../hooks/useUploadAdvisorPublicProfilePicture/useUploadAdvisorPublicProfilePicture';
import useDeleteAdvisorPublicProfilePicture from '../../hooks/useDeleteAdvisorPublicProfilePicture/useDeleteAdvisorPublicProfilePicture';

export function UploadAdvisorPictureButton() {
  const refreshProfileDetails = useSelectUpdateProfileDetailsQuery();
  const { data: advisorProfilePicture } =
    useSelectAdvisorPublicProfilePictureQuery();
  const { mutate, isLoading } = useUploadAdvisorPublicProfilePicture({
    onSuccess: () => refreshProfileDetails(),
  });
  const { mutate: deleteAdvisorPublicProfilePicture, isLoading: isDeleting } =
    useDeleteAdvisorPublicProfilePicture({
      onSuccess: () => refreshProfileDetails(),
    });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      mutate(formData);
    },
  });

  if (advisorProfilePicture !== null) {
    return (
      <Box display="flex" sx={{ gap: 2 }} alignItems="center">
        <Avatar src={advisorProfilePicture} alt="profile" variant="rounded" />
        <Button
          isLoading={isDeleting}
          startIcon={<DeleteIcon />}
          variant="text"
          onClick={() => deleteAdvisorPublicProfilePicture()}
        >
          Remove
        </Button>
        <div {...getRootProps()}>
          <input
            id="image-uploader"
            aria-label="replace profile picture"
            {...getInputProps()}
          />
          <Button
            isLoading={isLoading}
            startIcon={<SwapVertIcon />}
            variant="text"
          >
            Replace
          </Button>
        </div>
      </Box>
    );
  }

  return (
    <section>
      <div {...getRootProps()}>
        <input
          id="image-uploader"
          aria-label="upload profile picture"
          {...getInputProps()}
        />
        <Button
          isLoading={isLoading}
          startIcon={<PersonIcon />}
          fullWidth
          variant="outlined"
          size="large"
        >
          Add a profile picture
        </Button>
      </div>
    </section>
  );
}

export default UploadAdvisorPictureButton;
