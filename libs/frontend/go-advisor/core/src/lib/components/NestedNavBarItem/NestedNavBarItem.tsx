import type { SideNavbarItemProps } from '../SideNavbarItem/SideNavbarItem';

import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { ElementType, useReducer } from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  lighten,
  SvgIconProps,
  Collapse,
  List,
  Box,
} from '@bambu/react-ui';
import { SideNavbarItem } from '@bambu/go-advisor-auth-feature';

export interface NestedNavBarItemProps
  extends Omit<SideNavbarItemProps, 'Icon'> {
  Icon: ElementType<SvgIconProps>;
  children:
    | React.ReactElement<typeof SideNavbarItem>
    | React.ReactElement<typeof SideNavbarItem>[];
}

export function NestedNavBarItem({
  children,
  Icon,
  label,
}: NestedNavBarItemProps) {
  const [isExpanded, toggleExpanded] = useReducer((state) => !state, false);
  return (
    <ListItem
      sx={{ px: '0.75rem', flexDirection: 'column', alignItems: 'baseline' }}
      aira-label={`Open ${label} menu`}
    >
      <ListItemButton
        onClick={toggleExpanded}
        sx={(theme) => ({
          color: lighten(theme.palette.secondary.light, 0.5),
          width: '100%',
        })}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>
          <Icon sx={{ width: 20, height: 20 }} />
        </ListItemIcon>
        <Box display="flex" justifyContent="space-between" width="100%">
          <ListItemText
            primary={label}
            sx={{
              margin: 0,
              overflowWrap: 'break-word',
              width: '100%',
            }}
            primaryTypographyProps={{
              variant: 'subtitle2',
              sx: {
                wordWrap: 'break-word',
              },
            }}
          />
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </Box>
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List>{children}</List>
      </Collapse>
    </ListItem>
  );
}
