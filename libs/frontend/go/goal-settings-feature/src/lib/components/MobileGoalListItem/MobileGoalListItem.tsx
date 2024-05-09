import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@bambu/react-ui';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import type { GoalType } from '@bambu/go-core';

import PrimaryGoalIcon from '../icons/PrimaryGoalIcon/PrimaryGoalIcon';

export interface MobileGoalListItemProps {
  selected?: boolean;
  description: string;
  goalType: GoalType;
  onClick?: (goalType: GoalType) => void;
}

export function MobileGoalListItem({
  selected = false,
  onClick,
  goalType = 'Other',
  description = 'description',
}: MobileGoalListItemProps) {
  const handleClick = () => {
    onClick?.(goalType);
  };

  return (
    <ListItem>
      <ListItemButton
        aria-label={`select ${goalType}`}
        selected={selected}
        onClick={handleClick}
      >
        <ListItemIcon sx={{ color: 'inherit' }}>
          <PrimaryGoalIcon goalType={goalType} />
        </ListItemIcon>
        <ListItemText primary={description} />
        <ArrowRightIcon />
      </ListItemButton>
    </ListItem>
  );
}

export default MobileGoalListItem;
