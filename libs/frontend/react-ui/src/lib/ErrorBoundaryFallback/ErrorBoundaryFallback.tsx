import { Box, Container } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorImg from './assets/oops.svg';
import { Navigate, useRouteError } from 'react-router-dom';

export const ErrorBoundaryFallback = () => {
  const handleReload = () => window.location.reload();
  const error = useRouteError();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (error?.response?.statusText?.includes('Forbidden')) {
    return <Navigate to="/login" />;
  }

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        sx={{ minHeight: '100vh' }}
      >
        <Stack spacing={2} alignItems="center" data-testid="error-boundary">
          <img
            src={ErrorImg}
            alt="Something went wrong"
            width={260}
            height={263}
          />
          <Typography variant="h1" sx={{ fontSize: '3rem' }}>
            Oops!
          </Typography>
          <Typography>
            Something went wrong while displaying this page. Please reload or
            visit a different page to continue
          </Typography>
          <Box display="flex" alignItems="center">
            <Button onClick={handleReload}>Reload</Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default ErrorBoundaryFallback;
