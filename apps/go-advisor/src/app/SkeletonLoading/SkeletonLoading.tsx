import { Grid, Skeleton, Typography } from '@bambu/react-ui';

// @deprecated use the one from advisor-core
export const SkeletonLoading = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h1">
              <Skeleton width={200} />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Skeleton width={400} />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={7}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Skeleton variant="rectangular" height={600} />
      </Grid>
    </Grid>
  );
};

export default SkeletonLoading;
