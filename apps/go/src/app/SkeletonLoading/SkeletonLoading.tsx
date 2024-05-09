import { Skeleton, Typography, Stack } from '@bambu/react-ui';

export const SkeletonLoading = () => {
  return (
    <Stack spacing={4}>
      <Stack alignItems="center">
        <Typography variant="h1">
          <Skeleton width={200} />
        </Typography>
        <Typography>
          <Skeleton width={400} />
        </Typography>
      </Stack>
      <Stack spacing={1}>
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={40} />
      </Stack>
    </Stack>
  );
};

export default SkeletonLoading;
