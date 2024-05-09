import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import type { ReactNode } from 'react';
import Phone from './assets/phone.svg';

export interface PhonePreviewProps {
  children?: ReactNode;
}

const StyledImg = styled('img')({
  aspectRatio: '9/16.75',
});

const StyledPreviewContainer = styled('div')({
  position: 'absolute',
  width: 'calc(100% - 40px)',
  height: 'calc(100% - 96px)',
  top: 32,
  left: 20,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

export function MobilePreview({
  children = <Typography>Your content will be displayed here</Typography>,
}: PhonePreviewProps) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        position: 'relative',
      }}
    >
      <StyledImg src={Phone} alt="Phone" width={240} />
      <StyledPreviewContainer>{children}</StyledPreviewContainer>
    </Box>
  );
}

export default MobilePreview;
