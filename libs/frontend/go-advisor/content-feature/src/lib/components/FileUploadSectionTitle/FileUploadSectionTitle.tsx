import { Typography, Stack } from '@bambu/react-ui';

import type { ReactNode } from 'react';

export interface FileUploadSectionTitleProps {
  title: ReactNode;
  subtitle: ReactNode;
}

export function FileUploadSectionTitle({
  title,
  subtitle,
}: FileUploadSectionTitleProps) {
  return (
    <Stack spacing={2}>
      <Typography fontWeight={700}>{title}</Typography>
      <Typography>{subtitle}</Typography>
    </Stack>
  );
}

export default FileUploadSectionTitle;
