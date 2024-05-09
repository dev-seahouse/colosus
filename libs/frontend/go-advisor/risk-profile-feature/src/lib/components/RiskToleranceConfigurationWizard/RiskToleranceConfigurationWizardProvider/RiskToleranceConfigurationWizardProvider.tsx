import { useMemo, useState, useCallback, useContext } from 'react';
import RiskToleranceConfigurationWizardContext from './RiskToleranceConfigurationWizardContext';
import type { RiskToleranceConfigurationWizardContextValue } from './RiskToleranceConfigurationWizardContext';
import type { ReactNode } from 'react';

export interface RiskToleranceConfigurationWizardProviderProps {
  children: ReactNode;
}

export const RiskToleranceConfigurationWizardProvider = ({
  children,
}: RiskToleranceConfigurationWizardProviderProps) => {
  const [history, setHistory] = useState(['SELECTION']);

  const goToStep = useCallback((nextStep: string) => {
    setHistory((prevHistory) => [...prevHistory, nextStep]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  }, []);

  const memoizedValue = useMemo<RiskToleranceConfigurationWizardContextValue>(
    () => ({
      history,
      goToStep,
      goBack,
    }),
    [history, goToStep, goBack]
  );

  return (
    <RiskToleranceConfigurationWizardContext.Provider value={memoizedValue}>
      {children}
    </RiskToleranceConfigurationWizardContext.Provider>
  );
};

export default RiskToleranceConfigurationWizardProvider;
