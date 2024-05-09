import { makeDecorator } from '@storybook/preview-api';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

export const reactQueryDecorator = makeDecorator({
  name: 'reactQueryDecorator',
  parameterName: 'reactQuery',
  wrapper: (getStory, context, { parameters }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: Infinity,
          refetchOnWindowFocus: false,
        },
      },
    });

    if (parameters && parameters.setQueryData) {
      const { queryKey, data } = parameters.setQueryData;

      queryClient.setQueryData(
        typeof queryKey === 'string' ? [queryKey] : queryKey,
        () => ({
          ...data,
        })
      );
    }

    return (
      <QueryClientProvider client={queryClient}>
        {getStory(context) as ReactNode}
        {parameters && parameters.enableDevtools && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    );
  },
});

export default reactQueryDecorator;
