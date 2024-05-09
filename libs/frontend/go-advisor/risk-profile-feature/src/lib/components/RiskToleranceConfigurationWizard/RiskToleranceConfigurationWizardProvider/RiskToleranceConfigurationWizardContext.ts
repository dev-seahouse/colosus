import { createContext } from 'react';

export interface RiskToleranceConfigurationWizardContextValue {
  history: string[];
  goToStep: (step: string) => void;
  goBack: () => void;
}

export const RiskToleranceConfigurationWizardContext =
  createContext<RiskToleranceConfigurationWizardContextValue>(
    {} as RiskToleranceConfigurationWizardContextValue
  );

export default RiskToleranceConfigurationWizardContext;
