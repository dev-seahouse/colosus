import { Button, Typography } from '@bambu/react-ui';
import { useDropzone } from 'react-dropzone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useSelectUpdateProfileDetailsQuery } from '@bambu/go-advisor-core';

import useUploadAdvisorInternalProfilePicture from '../../hooks/useUploadAdvisorInternalProfilePicture/useUploadAdvisorInternalProfilePicture';

export const UploadProfilePictureButton = () => {
  const updateProfileDetailsQuery = useSelectUpdateProfileDetailsQuery();
  const { mutate, isLoading } = useUploadAdvisorInternalProfilePicture({
    onSuccess: () => updateProfileDetailsQuery(),
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png'],
    },
    onDrop: (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      mutate(formData);
    },
  });

  return (
    <div {...getRootProps()} data-testid="upload-profile-picture-btn">
      <input
        id="file-uploader"
        aria-label="upload profile picture"
        {...getInputProps()}
      />
      <Button
        isLoading={isLoading}
        startIcon={<FileUploadIcon />}
        variant="text"
      >
        Upload your profile picture
      </Button>
      <Typography variant="subtitle2">
        Choose a JPEG / PNG image with a minimum resolution of 300 x 300px
      </Typography>
    </div>
  );
};

export default UploadProfilePictureButton;
