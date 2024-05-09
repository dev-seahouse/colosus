import { Menu, MenuItem, Button, Box } from '@bambu/react-ui';
import { useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function RebalancingThresholdDropdownMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        sx={{ minWidth: '220px' }}
        id="rebalancing-threshold-menu-button"
        variant="outlined"
        size="large"
        aria-haspopup="true"
        disableElevation
        aria-controls={isOpen ? 'rebalancing-threshold-menu' : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        endIcon={isOpen ? <ArrowDropUpIcon /> : <ExpandMoreIcon />}
        onClick={handleMenuButtonClick}
        disabled={true}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          Threshold Rebalancing
        </Box>
      </Button>
      <Menu
        id="rebalancing-threshold-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        placeholder="Rebalancing Threshold"
        PaperProps={{
          sx: {
            minWidth: '200px',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'rebalancing-threshold-menu-button',
        }}
      >
        <MenuItem></MenuItem>
      </Menu>
    </>
  );
}

export default RebalancingThresholdDropdownMenu;
