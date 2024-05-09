import useRiskToleranceConfigurationWizardHistory from './RiskToleranceConfigurationWizardProvider/hooks/useRiskToleranceConfigurationWizardHistory';

import RiskToleranceSelection from './RiskToleranceSelection/RiskToleranceSelection';
import SelectRiskProfilePreview from './SelectRiskProfilePreview/SelectRiskProfilePreview';

export const RiskToleranceFlow = () => {
  const { current } = useRiskToleranceConfigurationWizardHistory();

  // will probably use hash map instead
  if (current === 'QUESTIONNAIRE') {
    return <SelectRiskProfilePreview />;
  }

  return <RiskToleranceSelection />;
};

export default RiskToleranceFlow;
