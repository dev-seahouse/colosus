import { lighten, styled } from '@bambu/react-ui';
import { Box } from '@bambu/react-ui';

export const DashboardLayout = styled(Box)(({ theme }) => ({
  height: '105px',
  [theme.breakpoints.up('sm')]: {
    height: '120px',
  },
  [theme.breakpoints.up('md')]: {
    height: '165px',
  },
  width: '100%',
  position: 'absolute',
  background: lighten(theme.palette.primary.main, 0.3),
}));
export default DashboardLayout;
