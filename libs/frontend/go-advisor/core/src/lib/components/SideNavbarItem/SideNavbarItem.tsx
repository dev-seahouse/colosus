import type { SvgIcon } from '@bambu/react-ui';
import {
  lighten,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@bambu/react-ui';
import { useNavigate, useLocation } from 'react-router-dom';

export interface SideNavbarItemProps {
  Icon?: typeof SvgIcon;
  label: string;
  path?: string;
  isOpen?: boolean;
}

export function SideNavbarItem({
  Icon,
  label,
  path = '',
  isOpen,
}: SideNavbarItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActivePath = location.pathname.includes(path);
  const onClick = () => navigate(path);

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
        onClick={onClick}
        sx={(theme) => ({
          color: lighten(theme.palette.secondary.light, 0.5),
          ...(isActivePath && {
            backgroundColor: alpha(theme.palette.primary.light, 0.2),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.light, 0.2),
            },
          }),
        })}
      >
        <ListItemIcon sx={{ color: 'inherit', minWidth: 34 }}>
          {Icon ? <Icon sx={{ width: 20, height: 20 }} /> : null}
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
