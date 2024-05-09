import { QueryClient } from '@tanstack/react-query';

/**
 * New instances of the query mount
  The window is refocused
  The network is reconnected
  The query is optionally configured with a refetch interval
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      retry: 5,
    },
  },
});
