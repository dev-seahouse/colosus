import { useContext } from 'react';

import RiskToleranceConfigurationWizardContext from '../RiskToleranceConfigurationWizardContext';

export const useRiskToleranceConfigurationWizardContext = () => {
  return useContext(RiskToleranceConfigurationWizardContext);
};

export default useRiskToleranceConfigurationWizardContext;
