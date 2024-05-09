import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import type { AppBarProps } from '@mui/material/AppBar';
import { Box } from '@mui/material';
import React from 'react';

export type ApplicationHeaderProps = AppBarProps & {
  Logo: React.ReactNode;
  Actions?: React.ReactNode;
};

export function ApplicationHeader({
  Logo,
  Actions,
  children,
  ...rest
}: ApplicationHeaderProps) {
  return (
    <AppBar {...rest}>
      <Toolbar>
        {/* Logo */}
        <Box
          sx={{
            marginRight: 2,
            gap: 1,
            flexGrow: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {Logo}
        </Box>
        {/* Navigation */}
        <Box
          sx={{
            marginRight: 1,
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {children}
        </Box>
        {/* Actions */}
        <Box display="flex" sx={{ gap: 1 }} alignItems="center">
          {Actions}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ApplicationHeader;
