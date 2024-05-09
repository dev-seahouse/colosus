import { Box, Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export function IntroductionContentButton() {
  const navigate = useNavigate();

  return (
    <Box
      sx={(theme) => ({
        [theme.breakpoints.down('md')]: {
          display: 'flex',
          justifyContent: 'space-around',
        },
      })}
    >
      <Button onClick={() => navigate('getting-to-know-you/name')}>
        Start planning
      </Button>
    </Box>
  );
}

export default IntroductionContentButton;
