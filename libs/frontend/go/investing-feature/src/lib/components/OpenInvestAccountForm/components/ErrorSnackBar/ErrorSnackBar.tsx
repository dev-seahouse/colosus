import { Box, Stack, Typography } from '@bambu/react-ui';

import ErrorIcon from '@mui/icons-material/Error';

export function ErrorSnackBar() {
  return (
    <Stack direction={'row'} alignItems={'center'} spacing={2}>
      <ErrorIcon color={'error'} />
      <Box>
        <Typography fontSize={'14px'} fontWeight={'bold'}>
          There was an error submitting your information.
        </Typography>
        <Typography fontSize={'14px'}>
          We apologize for any inconvenience caused.
        </Typography>
      </Box>
    </Stack>
  );
}
export default ErrorSnackBar;
