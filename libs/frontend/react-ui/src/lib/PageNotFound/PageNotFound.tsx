import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

import PageNotFoundIcon from './PageNotFoundIcon';

export const PAGE_NOT_FOUND_ID = 'page-not-found';

export function PageNotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  return (
    <Box
      id={PAGE_NOT_FOUND_ID}
      data-testid={PAGE_NOT_FOUND_ID}
      sx={{ minHeight: '100vh' }}
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      <Stack spacing={3} alignItems="center">
        <PageNotFoundIcon color="primary" sx={{ width: 88, height: 88 }} />
        <Typography variant="h1">Page not found</Typography>
        <Typography>
          We are sorry, but the page you’re looking for isn’t available.
        </Typography>
        <Box>
          <Button variant="outlined" fullWidth onClick={handleGoBack}>
            Go back to previous page
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default PageNotFound;
