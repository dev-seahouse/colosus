import { Button, Stack, Typography } from '@bambu/react-ui';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
export function ChangeRiskProfileAction() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('../investment-style');
  };
  return (
    <Stack>
      <Button variant="text" type="button" onClick={handleClick}>
        <Stack direction={'row'} spacing={1}>
          <RefreshIcon />
          <Typography variant={'body1'}>Change risk profile</Typography>
        </Stack>
      </Button>
    </Stack>
  );
}
