import { Chip } from '@bambu/react-ui';
import type { ChipProps } from '@bambu/react-ui';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export type PendingActionButtonProps = Pick<ChipProps, 'onClick'>;

export function PendingActionButton({ onClick }: PendingActionButtonProps) {
  return (
    <Chip
      onClick={onClick}
      role="button"
      icon={<ErrorOutlineOutlinedIcon color="error" />}
      label="Pending action"
      variant="outlined"
      size="small"
      clickable
      sx={{
        minWidth: 70,
        '&.MuiChip-root': {
          borderRadius: '8px !important',
        },
      }}
    />
  );
}

export default PendingActionButton;
