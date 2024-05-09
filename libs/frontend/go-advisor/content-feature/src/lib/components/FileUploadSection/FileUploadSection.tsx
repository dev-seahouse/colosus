import { Card, CardContent } from '@bambu/react-ui';

import type { ReactNode } from 'react';

/* eslint-disable-next-line */
export interface FileUploadSectionProps {
  children?: ReactNode;
}

export function FileUploadSection({
  children = 'content goes here',
}: FileUploadSectionProps) {
  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

export default FileUploadSection;
