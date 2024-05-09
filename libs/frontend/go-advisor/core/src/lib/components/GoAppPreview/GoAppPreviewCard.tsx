import { Box } from '@bambu/react-ui';
import { SectionContainer } from '../SectionContainer/SectionContainer';
import GoAppPreview from './GoAppPreview';

import type { ReactNode } from 'react';
export interface GoAppPreviewCardProps {
  children?: ReactNode;
}

export function GoAppPreviewCard({ children }: GoAppPreviewCardProps) {
  return (
    <SectionContainer title="Robo-advisor preview">
      <Box
        display="flex"
        justifyContent="space-around"
        sx={{
          '& .MuiToolbar-root': {
            marginRight: -2,
          },
        }}
      >
        <GoAppPreview>{children}</GoAppPreview>
      </Box>
    </SectionContainer>
  );
}

export default GoAppPreviewCard;
