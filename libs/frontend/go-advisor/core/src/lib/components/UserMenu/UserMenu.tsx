import { Button, Menu, MenuItem } from '@bambu/react-ui';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectResetApiStore } from '@bambu/api-client';
import { useQueryClient } from '@tanstack/react-query';
import UserAvatar from '../UserAvatar/UserAvatar';

import {
  useSelectUsernameQuery,
  useSelectHasUserCompletedProfileQuery,
  useSelectHasActiveSubscriptionQuery,
} from '../../hooks/useProfileDetails/useProfileDetails.selectors';

export function UserMenu() {
  const { data: username } = useSelectUsernameQuery();
  const { data: hasUserCompletedProfile } =
    useSelectHasUserCompletedProfileQuery();
  const { data: hasActiveSubscription } = useSelectHasActiveSubscriptionQuery();
  // TODO: update this with logout API
  const resetApiStore = useSelectResetApiStore();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigateToProfile = () => {
    navigate('/dashboard/manage-profile');
    handleClose();
  };

  const navigateToSubscription = () => {
    navigate('/dashboard/manage-subscription');
    handleClose();
  };

  const handleLogout = () => {
    resetApiStore();
    queryClient.clear();
  };

  return (
    <>
      <Button
        onClick={handleClick}
        type="button"
        data-testid="user-account-menu"
        aria-label="User's account menu"
        aria-haspopup="true"
        aria-controls={open ? 'user-account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        variant="text"
        size="large"
        color="inherit"
        endIcon={<UserAvatar />}
      >
        {username}
      </Button>
      <Menu
        id="user-account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-account-menu',
        }}
      >
        {hasUserCompletedProfile && (
          <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
        )}
        {hasActiveSubscription && (
          <MenuItem onClick={navigateToSubscription}>Subscription</MenuItem>
        )}
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;
