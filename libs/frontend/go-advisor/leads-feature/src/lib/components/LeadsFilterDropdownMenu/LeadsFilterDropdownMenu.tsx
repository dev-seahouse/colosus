import type { TLeadsCount, TLeadsTypes } from '@bambu/api-client';
import { LEADS_TYPES } from '@bambu/api-client';
import type { BadgeProps } from '@bambu/react-ui';
import { Badge, styled, Menu, MenuItem, Button, Box } from '@bambu/react-ui';
import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export interface LeadsFilterDropdownMenuProps {
  updateFilter: Dispatch<SetStateAction<TLeadsTypes>>;
  leadsCount?: TLeadsCount;
}
const StyledCountIndicatorIcon = styled(Badge)<BadgeProps>(() => ({
  '.MuiBadge-badge': {
    background: '#E9EAE9',
  },
}));

const options = [
  {
    type: LEADS_TYPES.QUALIFIED,
    name: 'Qualified leads',
  },
  {
    type: LEADS_TYPES.TRANSACT,
    name: 'Unqualified leads',
  },
  {
    type: LEADS_TYPES.ALL,
    name: 'View all leads',
  },
] as const;

const INDEX_OF_QUALIFIED_LEADS = 0;

export function LeadsFilterDropdownMenu({
  updateFilter,
  leadsCount,
}: LeadsFilterDropdownMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(INDEX_OF_QUALIFIED_LEADS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);
    updateFilter(options[index].type);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        sx={{ minWidth: '220px' }} // minwidth because badge is absolutely positioned
        id="leads-filter-menu-button"
        variant="outlined"
        size="large"
        aria-haspopup="true"
        disableElevation
        aria-controls={isOpen ? 'leads-filter-menu' : undefined}
        aria-expanded={isOpen ? 'true' : undefined}
        endIcon={isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        onClick={handleMenuButtonClick}
        disabled={!leadsCount?.ALL}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          {options[selectedIndex].name}
          <StyledCountIndicatorIcon
            badgeContent={leadsCount?.[options[selectedIndex].type] ?? 0}
            max={999}
            showZero
          />
        </Box>
      </Button>
      <Menu
        id="leads-filter-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: '200px',
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'leads-filter-menu-button',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option.name}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '90%',
              }}
            >
              {option.name}
              <StyledCountIndicatorIcon
                badgeContent={leadsCount?.[option.type] ?? 0}
                max={999}
                showZero
              />
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default LeadsFilterDropdownMenu;
