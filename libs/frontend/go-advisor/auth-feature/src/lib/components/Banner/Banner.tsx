import { Box, useMobileView } from '@bambu/react-ui';
import { useMemo } from 'react';

import Logo from './assets/logo.svg';

const LOGO_SIZE = {
  MOBILE: {
    WIDTH: 175,
    HEIGHT: 56,
  },
  DESKTOP: {
    WIDTH: 382,
    HEIGHT: 110,
  },
};

export function Banner() {
  const isMobile = useMobileView();
  const mode = useMemo(() => (isMobile ? 'MOBILE' : 'DESKTOP'), [isMobile]);

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={(theme) => ({
        [theme.breakpoints.up('md')]: {
          minWidth: 540,
          height: '100vh',
          aspectRatio: '4/5',
          justifyContent: 'space-around',
        },
      })}
      p={2}
    >
      <img
        src={Logo}
        alt="logo"
        width={LOGO_SIZE[mode].WIDTH}
        height={LOGO_SIZE[mode].HEIGHT}
      />
    </Box>
  );
}

export default Banner;
