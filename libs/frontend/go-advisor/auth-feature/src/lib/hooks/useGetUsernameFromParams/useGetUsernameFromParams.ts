import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * hook to get username from params
 */
export function useGetUsernameFromParams() {
  const [searchParams] = useSearchParams();
  const username = useMemo(() => searchParams.get('username'), [searchParams]);

  return username ?? '';
}

export default useGetUsernameFromParams;
