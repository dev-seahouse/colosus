import { Skeleton, Stack } from '@bambu/react-ui';

/**
 * placeholder component when loading lazy-loaded auth component
 */
export function LazyLoader() {
  return (
    <Stack spacing={2}>
      <Skeleton height={40} width={220} />
      <Stack>
        <Skeleton height={56} />
        <Skeleton height={56} />
      </Stack>
      <Stack>
        <Skeleton height={44} width={99} />
      </Stack>
    </Stack>
  );
}

export default LazyLoader;
