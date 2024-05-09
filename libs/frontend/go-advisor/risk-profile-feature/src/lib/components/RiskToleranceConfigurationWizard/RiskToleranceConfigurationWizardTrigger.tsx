import { Button } from '@bambu/react-ui';
import { useState, lazy, Suspense } from 'react';

const RiskToleranceConfigurationWizard = lazy(
  () => import('./RiskToleranceConfigurationWizard')
);

export const RiskToleranceConfigurationWizardTrigger = () => {
  const [open, setOpen] = useState(false);
  const [isWizardFetched, setIsWizardFetched] = useState(false);

  const handleOpenRiskToleranceConfigurationWizard = () => setOpen(true);

  const handleCloseRiskToleranceConfigurationWizard = () => setOpen(false);

  // download RiskToleranceConfigurationWizard resource only when the user hovers on the button
  const handleDownloadRiskToleranceConfigurationWizardResource = () =>
    setIsWizardFetched(true);

  return (
    <>
      <Button
        onMouseEnter={handleDownloadRiskToleranceConfigurationWizardResource}
        onClick={handleOpenRiskToleranceConfigurationWizard}
      >
        Configure settings
      </Button>
      {isWizardFetched && (
        <Suspense fallback={null}>
          <RiskToleranceConfigurationWizard
            open={open}
            onClose={handleCloseRiskToleranceConfigurationWizard}
          />
        </Suspense>
      )}
    </>
  );
};

export default RiskToleranceConfigurationWizardTrigger;
