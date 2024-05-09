import { Box, Drawer } from '@bambu/react-ui';
import type { DrawerProps } from '@bambu/react-ui';

import RiskToleranceConfigurationWizardHeader from './RiskToleranceConfigurationWizardHeader';
import RiskToleranceConfigurationWizardProvider from './RiskToleranceConfigurationWizardProvider/RiskToleranceConfigurationWizardProvider';
import RiskToleranceFlow from './RiskToleranceFlow';

export interface RiskToleranceConfigurationWizardProps {
  open?: DrawerProps['open'];
  onClose?: () => void;
}

export function RiskToleranceConfigurationWizard({
  open,
  onClose,
}: RiskToleranceConfigurationWizardProps) {
  return (
    <Drawer
      open={open}
      anchor="right"
      PaperProps={{
        sx: {
          pt: 8,
          width: 600,
        },
      }}
    >
      <RiskToleranceConfigurationWizardProvider>
        <RiskToleranceConfigurationWizardHeader onClose={onClose} />
        <Box px={4} flexGrow={1} alignItems="center" display="flex">
          <RiskToleranceFlow />
        </Box>
      </RiskToleranceConfigurationWizardProvider>
    </Drawer>
  );
}

export default RiskToleranceConfigurationWizard;
