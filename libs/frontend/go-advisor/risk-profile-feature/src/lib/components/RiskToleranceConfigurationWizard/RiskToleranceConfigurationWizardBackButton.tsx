import { Button } from '@bambu/react-ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import useRiskToleranceConfigurationWizardHistory from './RiskToleranceConfigurationWizardProvider/hooks/useRiskToleranceConfigurationWizardHistory';

export function RiskToleranceConfigurationWizardBackButton() {
  const { goBack } = useRiskToleranceConfigurationWizardHistory();

  return (
    <Button
      type="button"
      onClick={goBack}
      color="inherit"
      startIcon={<ArrowBackIcon />}
      variant="text"
    >
      Back
    </Button>
  );
}

export default RiskToleranceConfigurationWizardBackButton;
