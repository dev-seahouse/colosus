import {
  Avatar,
  Button,
  Container,
  Skeleton,
  Stack,
  Typography,
} from '@bambu/react-ui';

interface SkeletonLoadingProps {
  variant?: 'small' | 'large' | 'full';
}

const variants = {
  small: (
    <Container>
      <Stack spacing={1.3}>
        <Skeleton variant="rounded" height={30} />
        <Skeleton variant="rounded" height={30} />
        <Skeleton variant="rounded" height={30} />
      </Stack>
    </Container>
  ),
  large: (
    <Container>
      <Stack spacing={3}>
        <Stack alignItems="center">
          <Typography variant="h1">
            <Skeleton width={'50vw'} variant="text" />
          </Typography>
          <Typography>
            <Skeleton width={'60vw'} />
          </Typography>
        </Stack>
        <Stack spacing={1}>
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
          <Skeleton variant="rectangular" height={40} />
        </Stack>
      </Stack>
    </Container>
  ),
  full: (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={'56px'} animation={'wave'} />
      <Container sx={{ '&&': { margin: '0 auto' } }}>
        <Stack spacing={1}>
          <Skeleton animation={false} width={'70px'}>
            <Avatar />
          </Skeleton>
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Skeleton variant="rectangular" width={'100%'} height={30} />
              <Skeleton variant="text" width={'50%'} />
              <Skeleton variant="rounded" width={'80%'} height={50} />
            </Stack>
            <Skeleton variant="rectangular" width={'100%'} height={'40vh'} />

            <Stack
              justifyContent={'space-between'}
              gap={'30px'}
              direction={'row'}
            >
              <Skeleton height={70} width={'100%'} animation={'wave'}>
                <Button fullWidth>hello</Button>
              </Skeleton>
              <Skeleton height={70} width={'100%'} animation={'wave'}>
                <Button fullWidth>hello</Button>
              </Skeleton>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Stack>
  ),
};
export function SkeletonLoading({ variant = 'large' }: SkeletonLoadingProps) {
  return variants[variant];
}

export default SkeletonLoading;
