import { Button, Menu, MenuItem } from '@bambu/react-ui';
import { MouseEvent, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { selectAccessToken, useSelectResetApiStore } from '@bambu/api-client';
import { useQueryClient } from '@tanstack/react-query';

export function UserMenu() {
  const navigate = useNavigate();
  const resetApiStore = useSelectResetApiStore();
  const queryClient = useQueryClient();

  const menuID = 'investor-account-menu';
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const accessToken = selectAccessToken();

  const navigateToProfile = () => {
    navigate('/dashboard/manage-profile');
    handleClose();
  };

  const navigateToStatements = () => {
    navigate('/dashboard/manage-statements');
    handleClose();
  };

  const handleLogout = async () => {
    await new Promise((resolve) => {
      navigate('/');
      resolve(true);
    });
    resetApiStore();
    queryClient.invalidateQueries();
  };

  if (!accessToken) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleClick}
        type="button"
        data-testid={menuID}
        aria-label="User's account menu"
        aria-haspopup="true"
        aria-controls={open ? menuID : undefined}
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        size="large"
        color="inherit"
      >
        <MenuIcon />
      </Button>
      <Menu
        id={menuID}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': menuID,
        }}
      >
        {/* Profile */}
        <MenuItem onClick={navigateToProfile} disabled>
          Profile
        </MenuItem>
        {/* Account Statements */}
        <MenuItem onClick={navigateToStatements} disabled>
          Account Statements
        </MenuItem>
        {/* // Logout */}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;
