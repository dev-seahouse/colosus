import { Card, Box, Stack, Skeleton } from '@bambu/react-ui';

export const LeadsSettingFormFallback = () => {
  return (
    <Card>
      <Box p={3} sx={{ height: 424 }}>
        <Stack spacing={2}>
          <Stack>
            <Skeleton variant="text" height={32} width={256} />
            <Skeleton variant="text" width={512} />
          </Stack>
          <Stack>
            <Box display="flex" sx={{ gap: 2 }}>
              <Skeleton width={200} height={100} />
              <Box flexGrow={1}>
                <Skeleton height={50} />
                <Skeleton height={50} />
              </Box>
            </Box>
          </Stack>
          <Stack>
            <Box display="flex" sx={{ gap: 2 }}>
              <Skeleton width={200} height={100} />
              <Box flexGrow={1}>
                <Skeleton height={50} />
                <Skeleton height={50} />
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};

export default LeadsSettingFormFallback;
