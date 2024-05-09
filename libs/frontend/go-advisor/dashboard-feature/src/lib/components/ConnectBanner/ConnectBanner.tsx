import { Typography, Stack, Box, Button, Card } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import { InterestedInTransactLogo } from '../TransactBanner/assets/InterestedInTransactLogo';

export const ConnectBanner = () => {
  const navigate = useNavigate();

  return (
    <Card sx={{ background: '#F3FFF8', padding: '2rem' }}>
      <Stack direction="row" spacing={4} alignItems="center">
        <Stack spacing={3}>
          <Typography variant="h5">
            Take your robo to the next level with transactional features
          </Typography>
          <Typography>
            To offer transactional robo-advisor services that handle your
            clients’ investments, you’ll first need to verify that you are
            authorised to provide financial advice and manage investments on
            behalf of your clients.
          </Typography>
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <Button onClick={() => navigate('/select-subscription')}>
              Subscribe to start verification
            </Button>
          </Box>
        </Stack>
        <InterestedInTransactLogo />
      </Stack>
    </Card>
  );
};

export default ConnectBanner;
