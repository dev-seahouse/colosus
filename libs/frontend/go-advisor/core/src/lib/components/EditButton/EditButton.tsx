import { Chip } from '@bambu/react-ui';
import type { ChipProps } from '@bambu/react-ui';
import EditIcon from '@mui/icons-material/Edit';

export type EditButtonProps = Pick<ChipProps, 'onClick' | 'label' | 'icon'>;

/**
 * TODO: update the component's name to something more generic
 */
export function EditButton({
  onClick,
  label = 'Edit',
  icon = <EditIcon color="success" />,
}: EditButtonProps) {
  return (
    <Chip
      onClick={onClick}
      role="button"
      icon={icon}
      label={label}
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

export default EditButton;
