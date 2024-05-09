import type { MouseEventHandler } from 'react';
import { Chip } from '@bambu/react-ui';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export interface LeadsTableRowDetailsButtonProps {
  onClick?: MouseEventHandler;
}

function LeadsTableRowDetailsButton({
  onClick,
}: LeadsTableRowDetailsButtonProps) {
  return (
    <Chip
      component="button"
      label="More details"
      onClick={onClick}
      size="medium"
      variant="outlined"
      icon={<ArrowRightIcon color="primary" />}
      sx={{
        cursor: 'pointer',
        background: 'none',
        color: 'primary.main',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        width: '124px',
        '& .MuiChip-icon': {
          order: 1,
          marginRight: '10px',
          cursor: 'pointer',
        },
        '& .MuiChip-label': {
          textOverflow: 'clip',
        },
      }}
    />
  );
}

export default LeadsTableRowDetailsButton;
