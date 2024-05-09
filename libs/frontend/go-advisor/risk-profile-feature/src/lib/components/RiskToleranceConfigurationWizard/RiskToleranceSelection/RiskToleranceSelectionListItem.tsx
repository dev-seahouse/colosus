import { ListItem, ListItemButton, ListItemText } from '@bambu/react-ui';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import type { ListItemTextProps } from '@bambu/react-ui';

import useRiskToleranceConfigurationWizardHistory from '../RiskToleranceConfigurationWizardProvider/hooks/useRiskToleranceConfigurationWizardHistory';

export interface RiskToleranceSelectionListItemProps {
  primary: ListItemTextProps['primary'];
  secondary?: ListItemTextProps['secondary'];
}

export const RiskToleranceSelectionListItem = ({
  primary,
  secondary,
}: RiskToleranceSelectionListItemProps) => {
  const { goToStep } = useRiskToleranceConfigurationWizardHistory();

  return (
    <ListItem>
      <ListItemButton
        sx={(theme) => ({
          border: `1px solid ${theme.palette.divider}`,
        })}
        onClick={() => goToStep('QUESTIONNAIRE')}
      >
        <ListItemText primary={primary} {...(secondary && { secondary })} />
        <ArrowRightIcon />
      </ListItemButton>
    </ListItem>
  );
};

export default RiskToleranceSelectionListItem;
