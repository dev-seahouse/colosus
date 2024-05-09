import { IconButton, Menu, MenuItem } from '@bambu/react-ui';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useSelectActiveDirectDebitMandate,
  useSelectHasActiveDirectDebitSubscriptions,
} from '@bambu/go-core';

export function ManageGoalIconMenu() {
  const { goalId } = useParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data: activeMandate } = useSelectActiveDirectDebitMandate();
  // const activeMandate = getActiveMandate(directDebitMandates);
  const { data: hasActiveDirectDebitSubscription } =
    useSelectHasActiveDirectDebitSubscriptions(
      {
        goalId: goalId,
        mandateId: activeMandate?.id ?? '',
      },
      {
        enabled: !!activeMandate?.id && !!goalId,
      }
    );

  const isButtonDefaultButtonDisabled = !activeMandate;

  const handleMenuIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDepositClick = () => {
    navigate('/deposit/' + goalId);
  };

  const handleWithdrawalClick = () => {
    navigate('/withdrawal/' + goalId);
  };

  const handleCancelRecurringDepositClick = () => {
    navigate('/cancel-recurring-deposit/' + goalId);
  };

  const navigate = useNavigate();

  return (
    <div>
      <IconButton
        id={'manage-goals-menu-button'}
        aria-label="mangate goal menu button"
        aria-controls={open ? 'manage-goals-menu' : undefined}
        aria-haspopup={'true'}
        aira-expanded={open ? 'true' : undefined}
        onClick={handleMenuIconClick}
      >
        <MoreVertIcon color={'primary'} />
      </IconButton>
      <Menu
        id={'manage-goals-menu'}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'manage-goals-menu-button',
        }}
      >
        <MenuItem
          onClick={handleDepositClick}
          disabled={isButtonDefaultButtonDisabled}
        >
          Deposit
        </MenuItem>
        <MenuItem
          onClick={handleWithdrawalClick}
          disabled={
            isButtonDefaultButtonDisabled || !hasActiveDirectDebitSubscription
          }
        >
          Withdrawal
        </MenuItem>
        <MenuItem
          onClick={handleCancelRecurringDepositClick}
          disabled={
            isButtonDefaultButtonDisabled || !hasActiveDirectDebitSubscription
          }
        >
          Cancel recurring deposit
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ManageGoalIconMenu;
