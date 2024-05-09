import { Card, Box, Typography, Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export interface BackToDashboardBannerProps {
  title?: string;
  subtitle?: string;
}

export function BackToDashboardBanner({
  title = 'Made all the changes that you wanted to?',
  subtitle = 'You can continue to set up your robo-advisor by following the setup tasks on the dashboard.',
}) {
  const navigate = useNavigate();

  const handleClick = () => navigate('../home');

  return (
    <Card>
      <Box p={4} display="flex" alignItems="center" sx={{ gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography>{subtitle}</Typography>
        </Box>
        <Box>
          <Button onClick={handleClick} variant="outlined">
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

export default BackToDashboardBanner;
