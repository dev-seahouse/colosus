import { Button } from '@bambu/react-ui';
import { useNavigate } from 'react-router-dom';
import { selectAccessToken } from '@bambu/api-client';
import { BottomActionLayout } from '@bambu/go-core';
import { useSelectUpdateProjectedRecommendation } from '../../store/useGoalSettingsStore.selectors';

export function InvestNowAction() {
  const accessToken = selectAccessToken();

  const updateProjectedRecommendation =
    useSelectUpdateProjectedRecommendation();

  const navigate = useNavigate();
  return (
    <BottomActionLayout
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
      }}
    >
      <Button
        variant="outlined"
        sx={{ flex: [1, 0], minWidth: '120px' }}
        disabled
      >
        Save goal
      </Button>
      <Button
        sx={{ flex: [1, 0], minWidth: '120px' }}
        onClick={() => {
          updateProjectedRecommendation();
          navigate(accessToken ? '../dashboard' : '../robo-instructions');
        }}
      >
        Invest now
      </Button>
    </BottomActionLayout>
  );
}

export default InvestNowAction;
