import { Box, useMobileView } from '@bambu/react-ui';

import DesktopView from './DesktopView';
import MobileView from './MobileView';
import Header from '../../components/Header/Header';

export function DashboardPage() {
  const isMobile = useMobileView();

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        minHeight: '100vh',
        pt: 8,
        [theme.breakpoints.up('md')]: {
          pl: 32,
        },
      })}
    >
      <Header />
      {isMobile ? <MobileView /> : <DesktopView />}
    </Box>
  );
}

export default DashboardPage;
