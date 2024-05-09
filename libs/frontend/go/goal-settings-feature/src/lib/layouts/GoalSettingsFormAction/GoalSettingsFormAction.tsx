import { Box } from '@bambu/react-ui';
import type { PropsWithChildren } from 'react';

export function GoalSettingsFormAction({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {children}
    </Box>
  );
}

export default GoalSettingsFormAction;
