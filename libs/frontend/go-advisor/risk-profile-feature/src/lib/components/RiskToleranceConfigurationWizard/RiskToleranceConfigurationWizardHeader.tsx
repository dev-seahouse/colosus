import { Box, IconButton } from '@bambu/react-ui';
import CloseIcon from '@mui/icons-material/Close';

import useRiskToleranceConfigurationWizardHistory from './RiskToleranceConfigurationWizardProvider/hooks/useRiskToleranceConfigurationWizardHistory';
import RiskToleranceConfigurationWizardBackButton from './RiskToleranceConfigurationWizardBackButton';

export interface RiskToleranceConfigurationWizardHeaderProps {
  onClose?: () => void;
}

export const RiskToleranceConfigurationWizardHeader = ({
  onClose,
}: RiskToleranceConfigurationWizardHeaderProps) => {
  const { isRoot } = useRiskToleranceConfigurationWizardHistory();

  return (
    <Box
      display="flex"
      justifyContent={!isRoot ? 'space-between' : 'flex-end'}
      alignItems="center"
      py={3}
      pl={4}
      pr={2}
    >
      {!isRoot && <RiskToleranceConfigurationWizardBackButton />}
      <IconButton
        onClick={onClose}
        aria-label="close risk tolerance configuration wizard drawer"
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default RiskToleranceConfigurationWizardHeader;
