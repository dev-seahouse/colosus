import type { SvgIcon } from '@bambu/react-ui';
import {
  lighten,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  darken,
} from '@bambu/react-ui';
import { useNavigate, useLocation } from 'react-router-dom';

export interface SideNavbarItemProps {
  Icon: typeof SvgIcon;
  label: string;
  path?: string;
}

export function SideNavbarItem({
  Icon,
  label,
  path = '',
}: SideNavbarItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActivePath = location.pathname.includes(path);

  const handleClick = () => navigate(path);

  return (
    <ListItem
      sx={(theme) => ({
        paddingLeft: '0.75rem',
        paddingRight: '0.75rem',
      })}
    >
      <ListItemButton
        {...(isActivePath && { 'aria-current': 'page' })}
        aria-label={`Navigate to ${label}`}
        data-testid={`nav-${label.toLowerCase()}`}
        onClick={handleClick}
        sx={(theme) => ({
          color: lighten(theme.palette.secondary.light, 0.4),
          ...(isActivePath && {
            backgroundColor: darken(theme.palette.secondary.main, 0.2),
            '&:hover': {
              backgroundColor: darken(theme.palette.secondary.main, 0.2),
            },
          }),
        })}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>
          <Icon sx={{ width: 20, height: 20 }} />
        </ListItemIcon>
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
      </ListItemButton>
    </ListItem>
  );
}

export default SideNavbarItem;
