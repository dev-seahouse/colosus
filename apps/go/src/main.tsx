import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { setupApiStoreWithOriginOverride } from '@bambu/api-client';
import App from './app/App';
import { TagManagerProvider } from '@bambu/go-advisor-analytics';

import { queryClient } from './queryClient';
import './styles.css';
import { FFContextProvider } from '@harnessio/ff-react-client-sdk';
import { SnackbarProvider } from '@bambu/react-ui';

const render = () => {
  // if true, use mock server
  if (import.meta.env.VITE_CONNECT_INVESTOR_USE_MOCK === 'true') {
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
              id: import.meta.env.VITE_INVESTOR_GTM_ID,
            }}
          >
            <App />
          </TagManagerProvider>
        </FFContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        />
      </QueryClientProvider>
    </StrictMode>
  );
};

// render app with override in DEV mode
if (import.meta.env.DEV) {
  setupApiStoreWithOriginOverride({
    originOverride: import.meta.env.VITE_CONNECT_INVESTOR_API_ORIGIN_OVERRIDE,
  }).then(() => render());
} else {
  render();
}
