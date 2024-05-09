import { Box, Toolbar, styled } from '@bambu/react-ui';
import type { SxProps } from '@bambu/react-ui';
import { PropsWithChildren } from 'react';

const StyledBottomActionLayout = styled(Toolbar)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  bottom: 0,
  left: 0,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[6],
  [theme.breakpoints.up('sm')]: {
    boxShadow: 'none',
    position: 'static',
    paddingLeft: 0,
    paddingRight: 0,
    background: 'unset',
  },
}));

/**
 * BottomActionLayout
 * responsive layout that places its children at the bottom of the screen
 * on breakpoint-xs and breakpoint-sm, and follows document flow on breakpoints-md and up
 * this component should not have opinion about alignment, e.g justify-content, align-items, etc
 */
export function BottomActionLayout({
  children,
  sx,
}: PropsWithChildren<{ sx?: SxProps }>) {
  return (
    <>
      <Box sx={{ py: [5, 0] }}></Box>
      <StyledBottomActionLayout sx={{ px: 2, py: 2.7, ...sx }}>
        {children}
      </StyledBottomActionLayout>
    </>
  );
}

export default BottomActionLayout;
