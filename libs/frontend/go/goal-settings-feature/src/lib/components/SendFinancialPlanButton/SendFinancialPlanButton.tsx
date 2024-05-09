import IosShareIcon from '@mui/icons-material/IosShare';
import { Button } from '@bambu/react-ui';
import { useSelectUpdateProjectedRecommendation } from '../../store/useGoalSettingsStore.selectors';
import { useNavigate } from 'react-router-dom';

export function SendFinancialPlanButton() {
  const navigate = useNavigate();
  const updateProjectedRecommendation =
    useSelectUpdateProjectedRecommendation();

  const navigateToGetFinancialPlanPage = () => {
    updateProjectedRecommendation();
    navigate('/get-financial-plan');
  };

  return (
    <Button
      onClick={navigateToGetFinancialPlanPage}
      startIcon={<IosShareIcon />}
      variant="outlined"
      fullWidth
    >
      Send me a copy of this plan
    </Button>
  );
}

export default SendFinancialPlanButton;
