import React, { useEffect, useState } from 'react';

import type { DropzoneOptions } from 'react-dropzone';
import { useDropzone } from 'react-dropzone';

import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';

import type { ButtonProps } from '../Button/Button';
import Button from '../Button/Button';

interface FileUploadButtonProps
  extends Omit<ButtonProps, 'children' | 'onClick'> {
  label?: ButtonProps['children'];
}

export interface UploadedFile {
  formData?: FormData;
  url: string;
}

export interface FileUploadProps<T extends boolean = false> {
  UploadButtonProps?: FileUploadButtonProps;
  RemoveButtonProps?: FileUploadButtonProps;
  helperText?: FormHelperTextProps['children'];
  onDrop?: (acceptedFile: UploadedFile) => void;
  showPreview?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: UploadedFile | null;
  value?: UploadedFile | null;
  options?: Omit<DropzoneOptions, 'onDrop'>;
  fileName?: string;
  isRemovable?: T;
  onRemove?: T extends true ? () => void : never;
}
export const FileUpload = React.forwardRef(function FileUpload<
  T extends boolean = false
>(
  {
    RemoveButtonProps,
    UploadButtonProps,
    helperText,
    showPreview = false,
    onDrop,
    isLoading,
    disabled,
    value = null,
    options = {
      accept: {
        'application/pdf': ['.pdf'],
      },
    },
    fileName = 'file',
    isRemovable = false as T,
    onRemove,
  }: FileUploadProps<T>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [preview, setPreview] = useState('');
  useEffect(() => {
    return () => {
      if (showPreview && preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, showPreview]);
  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    onDrop: (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));

      const newFile: UploadedFile = {
        formData,
        url: acceptedFiles[0].name,
      };

      onDrop?.(newFile);
    },
  });

  const viewFile = () => {
    window.open(value?.url, '_blank');
  };

  const openPreview = (fileData: string) => {
    window.open(fileData, '_blank');
  };

  function handleRemove() {
    if (!isRemovable) {
      throw new Error("Can't remove file if isRemovable is false");
    }
    if (preview) {
      setPreview('');
      URL.revokeObjectURL(preview);
    }
    if (typeof onRemove === 'function') {
      onRemove();
    }
  }

  if (value?.url) {
    return (
      <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
        <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
          <DownloadDoneIcon fontSize="small" />
          <Typography>{fileName}</Typography>
        </Box>
        <div>
          <Button
            onClick={showPreview ? () => openPreview(preview) : viewFile}
            startIcon={<VisibilityIcon />}
            variant="text"
            aria-label="view file"
            disabled={disabled}
            isLoading={isLoading}
          >
            View
          </Button>
        </div>
        <div {...getRootProps()}>
          <input
            id="file-uploader"
            aria-label="upload file"
            {...getInputProps()}
            ref={ref}
          />
          {isRemovable ? null : (
            <Button
              startIcon={<SwapVertIcon />}
              variant="text"
              disabled={disabled}
              isLoading={isLoading}
              {...UploadButtonProps}
            >
              Replace
            </Button>
          )}
        </div>
        {isRemovable ? (
          <Button
            startIcon={<DeleteIcon />}
            variant="text"
            disabled={disabled}
            isLoading={isLoading}
            onClick={handleRemove}
            {...RemoveButtonProps}
          >
            Remove
          </Button>
        ) : null}
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
      <div {...getRootProps()}>
        <input
          id="file-uploader"
          aria-label="upload file"
          {...getInputProps()}
        />
        <Button
          startIcon={<FileUploadIcon />}
          variant="outlined"
          {...UploadButtonProps}
        >
          {UploadButtonProps?.label ?? 'Upload File'}
        </Button>
      </div>
      {helperText && <Typography variant="caption">{helperText}</Typography>}
    </Box>
  );
});

export default FileUpload;
