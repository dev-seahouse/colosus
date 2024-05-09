import { Box, Container } from '@bambu/react-ui';
import { Outlet } from 'react-router-dom';

import SideNavbar from '../../components/SideNavbar/SideNavbar';

export const DesktopView = () => (
  <>
    <SideNavbar />
    <Box component="main" sx={{ flexGrow: 1, pt: 8, pl: 4, pr: 4, pb: 8 }}>
      <Container>
        <Outlet />
      </Container>
    </Box>
  </>
);

export default DesktopView;
