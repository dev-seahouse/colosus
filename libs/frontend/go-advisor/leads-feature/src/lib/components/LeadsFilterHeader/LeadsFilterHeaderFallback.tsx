import { Skeleton, Card, Box } from '@bambu/react-ui';

export const LeadsFilterHeaderFallback = () => (
  <Card>
    <Box p={3} display="flex" alignItems="center" sx={{ gap: 2 }}>
      <Box sx={{ width: 100 }}>
        <Skeleton />
      </Box>
      <Box flexGrow={1}>
        <Skeleton />
      </Box>
    </Box>
  </Card>
);

export default LeadsFilterHeaderFallback;
