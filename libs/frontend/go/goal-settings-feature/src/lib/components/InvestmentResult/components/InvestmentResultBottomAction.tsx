import { BottomAction } from '@bambu/go-core';
import GoalSettingsFormAction from '../../../layouts/GoalSettingsFormAction/GoalSettingsFormAction';
import { BackButton, Box, Button, Stack } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';

export function InvestmentResultBottomAction() {
  return (
    <Stack>
      <Box display={{ xs: 'block', sm: 'none' }}>
        <BottomAction>
          <InvestmentResultActions />
        </BottomAction>
      </Box>
      <Box display={{ xs: 'none', sm: 'flex' }} justifyContent="space-around">
        <InvestmentResultActions />
      </Box>
    </Stack>
  );
}

export function InvestmentResultActions() {
  const navigate = useNavigate();
  function handleNextClick() {
    navigate('../setup-contribution');
  }
  return (
    <GoalSettingsFormAction>
      <BackButton
        fullWidth
        variant="outlined"
        startIcon={null}
        color="primary"
      />
      <Button
        fullWidth
        type="submit"
        variant="contained"
        onClick={handleNextClick}
      >
        Next
      </Button>
    </GoalSettingsFormAction>
  );
}
