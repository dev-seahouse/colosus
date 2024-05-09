import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import {
  ThemeProvider,
  createBambuTheme,
  SnackbarProvider,
} from '@bambu/react-ui';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import type { RenderOptions } from '@testing-library/react';
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook';

const theme = createBambuTheme();

export interface AllTheProvidersProps {
  children?: ReactNode;
  queryClient?: QueryClient;
  path?: string;
}

const AllTheProviders = ({
  children,
  queryClient = new QueryClient({
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => null,
    },
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  }),
  path = '/',
}: AllTheProvidersProps) => {
  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[path]}>
        <QueryClientProvider client={queryClient}>
          <GTMProvider>{children}</GTMProvider>
          <SnackbarProvider />
        </QueryClientProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
};

export interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  path?: string;
}

export const customRender = (ui: ReactElement, options?: CustomRenderOptions) =>
  render(ui, {
    wrapper: (props) => (
      <AllTheProviders
        queryClient={options?.queryClient}
        path={options?.path}
        {...props}
      />
    ),
    ...options,
  });

export default customRender;
