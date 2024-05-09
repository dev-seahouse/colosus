import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

export interface QueryClientWrapperProps {
  children?: ReactNode;
}

export const queryClientWrapper = ({ children }: QueryClientWrapperProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export default queryClientWrapper;
