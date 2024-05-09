import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  CssBaseline,
  ThemeProvider,
  SnackbarProvider,
  NavigatorOnlineProvider,
} from '@bambu/react-ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TagManagerProvider } from '@bambu/go-advisor-analytics';

import App from './app/App';
import { theme } from './theme';
import { queryClient } from './queryClient';
import './styles.css';
import { FFContextProvider } from '@harnessio/ff-react-client-sdk';

// if true, use mock server
if (import.meta.env.VITE_CONNECT_ADVISOR_USE_MOCK === 'true') {
  (async () => {
    const { worker } = await import('./mocks/browser');

    await worker.start();
  })();
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <FFContextProvider
          apiKey={import.meta.env.VITE_GO_FE_FEATURE_FLAG_API_KEY}
          target={{
            name: 'ReactClientSDK',
            identifier: 'reactclientsdk',
          }}
        >
          <TagManagerProvider
            params={{
              id: import.meta.env.VITE_ADVISOR_GTM_ID,
            }}
          >
            <NavigatorOnlineProvider>
              <App />
            </NavigatorOnlineProvider>
          </TagManagerProvider>
        </FFContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </QueryClientProvider>
      <CssBaseline />
    </ThemeProvider>
  </StrictMode>
);
