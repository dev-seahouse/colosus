import { Stack, Typography } from '@bambu/react-ui';
import { PropsWithChildren } from 'react';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

/**
 * a very frequently used component for displaying recommendation message
 */

export function RecommendationBanner({
  isShown = false,
  children,
}: PropsWithChildren<{ isShown?: boolean | null }>) {
  if (!isShown) {
    return;
  }
  return (
    <Stack
      direction={'row'}
      spacing={1}
      justifyContent={'flex-start'}
      p={2}
      sx={{
        '&&': { marginTop: 0 },
        backgroundColor: '#F3FFF8',
      }}
    >
      <LightbulbIcon
        sx={{
          color: '#00876a',
          fontSize: 23,
        }}
      />
      <Typography variant={'body2'} fontWeight={500}>
        {children}
      </Typography>
    </Stack>
  );
}

export default RecommendationBanner;
