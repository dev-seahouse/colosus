import { Box, Stack, Typography } from '@bambu/react-ui';
import { VideoPlayer } from '@bambu/go-advisor-core';

export function TalkingPoint() {
  return (
    <Box
      sx={{
        bgcolor: 'primary.contrastText',
        border: '1px solid #E5E7EB',
        boxShadow:
          '0px 1px 2px rgba(0, 0, 0, 0.05), 0px 1px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
      }}
      p={4}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: '1.5rem' }}>
              Let clients know you can realize their goals
            </Typography>
            <Typography variant="body1">
              Configure your portfolios and Bambu GO will ensure your clients
              see the products that match their investment needs.
            </Typography>
          </Stack>
        </Box>
        <Box>
          <VideoPlayer type="Portfolio" />
        </Box>
      </Box>
    </Box>
  );
}

export default TalkingPoint;
