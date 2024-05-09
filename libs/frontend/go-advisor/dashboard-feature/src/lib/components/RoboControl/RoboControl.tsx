import ViewRoboButton from './ViewRoboButton';
import ShareRoboButton from './ShareRoboButton';
import { Box } from '@bambu/react-ui';

export function RoboControl() {
  return (
    <Box
      display="flex"
      sx={{ gap: 1, minWidth: 368 }}
      justifyContent="flex-end"
    >
      <ViewRoboButton />
      <ShareRoboButton />
    </Box>
  );
}

export default RoboControl;
