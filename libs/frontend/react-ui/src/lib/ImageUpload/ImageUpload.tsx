import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

const ThumbContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const Thumb = styled('div')(({ theme }) => ({
  display: 'inline-flex',
  borderRadius: 4,
  maxWidth: 164,
  height: 68,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  backgroundColor: '#EFF1EE',
  marginRight: theme.spacing(2),
}));

const ThumbInner = styled('div')({
  display: 'flex',
});

const Img = styled('img')({
  objectFit: 'contain',
  width: '100%',
  height: '100%',
});

interface ImageUploadButtonProps
  extends Omit<MuiButtonProps, 'children' | 'onClick'> {
  label?: MuiButtonProps['children'];
}

export interface ImageFile {
  formData?: FormData;
  url: string;
}

export interface ImageUploadProps {
  UploadButtonProps?: ImageUploadButtonProps;
  RemoveButtonProps?: ImageUploadButtonProps;
  helperText?: FormHelperTextProps['children'];
  onDrop?: (acceptedImg: ImageFile) => void;
  onRemove?: () => void;
  defaultValue?: ImageFile | null;
}

export function ImageUpload({
  UploadButtonProps,
  RemoveButtonProps,
  helperText,
  onDrop,
  onRemove,
  defaultValue = null,
}: ImageUploadProps) {
  const [image, setImage] = useState<ImageFile | null>(defaultValue);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      const imageFile: ImageFile = {
        formData,
        url: URL.createObjectURL(acceptedFiles[0]),
      };

      setImage(imageFile);

      if (onDrop) {
        onDrop(imageFile);
      }
    },
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (image) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [image]);

  const removeImage = () => {
    setImage(null);

    if (onRemove) {
      onRemove();
    }
  };

  if (image !== null) {
    return (
      <ThumbContainer>
        <Thumb>
          <ThumbInner>
            <Img
              src={image.url}
              alt="thumbnail"
              onLoad={() => URL.revokeObjectURL(image.url)}
            />
          </ThumbInner>
        </Thumb>
        <Button
          startIcon={<DeleteIcon />}
          onClick={removeImage}
          variant="text"
          {...RemoveButtonProps}
        >
          {RemoveButtonProps?.label ?? 'Remove image'}
        </Button>
      </ThumbContainer>
    );
  }

  return (
    <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
      <Box sx={{ flexGrow: 1, minWidth: 180 }}>
        <div {...getRootProps()}>
          <input
            id="image-uploader"
            aria-label="upload image"
            {...getInputProps()}
          />
          <Button
            startIcon={<FileUploadIcon />}
            variant="outlined"
            {...UploadButtonProps}
          >
            {UploadButtonProps?.label ?? 'Upload image'}
          </Button>
        </div>
      </Box>
      {helperText && <Typography variant="caption">{helperText}</Typography>}
    </Box>
  );
}

export default ImageUpload;
