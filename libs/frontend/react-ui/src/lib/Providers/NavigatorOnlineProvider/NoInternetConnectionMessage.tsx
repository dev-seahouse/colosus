import WifiOffOutlinedIcon from '@mui/icons-material/WifiOffOutlined';
import { Stack, Box, Typography, Button } from '@mui/material';

export function NoInternetConnectionMessage() {
  return (
    <Box
      data-testid="no-internet-connection-message"
      sx={{ minHeight: '100vh' }}
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      <Stack spacing={2} alignItems="center">
        <WifiOffOutlinedIcon color="primary" sx={{ width: 88, height: 88 }} />
        <Typography variant="h1">No internet connection</Typography>
        <Typography>Check your connection or try again.</Typography>
        <Box>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default NoInternetConnectionMessage;
