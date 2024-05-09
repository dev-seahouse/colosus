import { Typography, Stack } from '@bambu/react-ui';
import { useSelectFirstNameQuery } from '@bambu/go-advisor-core';
import { Box } from '@bambu/react-ui';
import Banner from '../Banner/Banner';
import RoboControl from '../RoboControl/RoboControl';

export const ReadyForPreviewBanner = () => {
  const { data: fistName } = useSelectFirstNameQuery();

  return (
    <Banner data-testid="ready-for-preview-banner">
      <Box display="flex" alignItems="center" sx={{ gap: 1 }}>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <Typography variant="h5">Great job, {fistName}!</Typography>
          <Typography>
            You can now preview your non-transactional robo-advisor.
          </Typography>
        </Stack>
        <RoboControl />
      </Box>
    </Banner>
  );
};

export default ReadyForPreviewBanner;
