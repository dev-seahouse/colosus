import { Box, Card, CardContent } from '@bambu/react-ui';
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Banner from '../../components/Banner/Banner';
import BackgroundImg from './assets/Background.svg';

/**
 * mostly static dumb component with ability to redirect user with active session
 */
export function LayoutWithBackground() {
  const [sourceLoaded, setSourceLoaded] = useState<null | string>(null);

  useEffect(() => {
    const img = new Image();
    img.src = BackgroundImg;
    // "lazy load" background to avoid seeing white background on page load
    img.onload = () => setSourceLoaded(BackgroundImg);
  }, []);

  return (
    <Box
      display="flex"
      sx={(theme) => ({
        ...(sourceLoaded
          ? {
              backgroundImage: `url(${sourceLoaded})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }
          : {
              background: `linear-gradient(45deg, #5aa7c6, #95ceaa)`,
            }),
        [theme.breakpoints.down('md')]: {
          flexDirection: 'column',
          minHeight: '100vh',
        },
      })}
    >
      <Banner />
      <Box
        display="flex"
        sx={(theme) => ({
          flexGrow: 1,
          p: 4,
          alignItems: 'center',
          justifyContent: 'space-around',
          [theme.breakpoints.down('md')]: {
            alignItems: 'flex-start',
            paddingTop: 2,
          },
        })}
      >
        <Box sx={{ width: 480 }}>
          <Card>
            <CardContent
              sx={(theme) => ({
                p: 5,
                [theme.breakpoints.down('md')]: { p: 4 },
              })}
            >
              <Outlet />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default LayoutWithBackground;
