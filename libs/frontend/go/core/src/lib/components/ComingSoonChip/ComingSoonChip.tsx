import { Chip } from '@bambu/react-ui';

export function ComingSoonChip() {
  return (
    <Chip
      label="COMING SOON"
      color="warning"
      size="small"
      sx={(theme) => ({
        color: theme.palette.common.white,
        boxShadow: theme.shadows[1],
        fontSize: '0.5em',
      })}
    />
  );
}

export default ComingSoonChip;
