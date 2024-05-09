import { act, renderHook } from '@bambu/react-test-utils';

import useRiskToleranceConfigurationWizardHistory from './useRiskToleranceConfigurationWizardHistory';
import RiskToleranceConfigurationWizardProvider from '../RiskToleranceConfigurationWizardProvider';
describe('useRiskToleranceConfigurationWizardHistory', () => {
  it('should return isRoot === true if last step is the first step', () => {
    const { result } = renderHook(
      () => useRiskToleranceConfigurationWizardHistory(),
      {
        wrapper: ({ children }) => (
          <RiskToleranceConfigurationWizardProvider>
            {children}
          </RiskToleranceConfigurationWizardProvider>
        ),
      }
    );

    expect(result.current.isRoot).toBe(true);
  });

  it('should return isRoot === false if last step is not the first step', async () => {
    const { result } = renderHook(
      () => useRiskToleranceConfigurationWizardHistory(),
      {
        wrapper: ({ children }) => (
          <RiskToleranceConfigurationWizardProvider>
            {children}
          </RiskToleranceConfigurationWizardProvider>
        ),
      }
    );

    act(() => result.current.goToStep('NEXT_STEP'));

    await expect(result.current.isRoot).toBe(false);
  });
});
