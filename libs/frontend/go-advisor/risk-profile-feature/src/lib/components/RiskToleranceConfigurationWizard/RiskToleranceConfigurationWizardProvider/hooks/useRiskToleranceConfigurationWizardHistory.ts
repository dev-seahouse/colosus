import useRiskToleranceConfigurationWizardContext from './useRiskToleranceConfigurationWizardContext';
import { useMemo } from 'react';

export const useRiskToleranceConfigurationWizardHistory = () => {
  const { goToStep, goBack, history } =
    useRiskToleranceConfigurationWizardContext();

  const isRoot = useMemo(() => {
    const lastStep = history[history.length - 1];

    return lastStep === 'SELECTION';
  }, [history]);

  const current = useMemo(() => history[history.length - 1], [history]);

  return { goToStep, goBack, isRoot, current };
};

export default useRiskToleranceConfigurationWizardHistory;
