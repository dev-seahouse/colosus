import type { SvgIconTypeMap } from '@bambu/react-ui';
import { Stack, Typography } from '@bambu/react-ui';
import type { OverridableComponent } from '@mui/material/OverridableComponent';

export interface GoalSettingsFormHeaderProps {
  Icon: OverridableComponent<SvgIconTypeMap>;
  title: string;
}

export function GoalSettingsFormHeader({
  Icon,
  title,
}: GoalSettingsFormHeaderProps) {
  return (
    <Stack spacing={1}>
      <Icon fontSize="large" color="primary" />
      <Typography variant="h1">{title}</Typography>
    </Stack>
  );
}

export default GoalSettingsFormHeader;
