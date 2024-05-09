import { makeDecorator } from '@storybook/preview-api';

import { GTMProvider } from '@elgorditosalsero/react-gtm-hook';
import { ThemeProvider, CssBaseline, SnackbarProvider } from '@bambu/react-ui';
import type { ReactNode } from 'react';
import { FFContextProvider } from '@harnessio/ff-react-client-sdk';

export const bambuUiDecorator = makeDecorator({
  name: 'bambuUiDecorator',
  parameterName: 'bambuUi',
  wrapper: (getStory, context, { parameters }) => {
    const { theme } = parameters;

    return (
      <ThemeProvider theme={theme}>
        <GTMProvider>
          <FFContextProvider
            apiKey={import.meta.env.VITE_GO_FE_FEATURE_FLAG_API_KEY}
            target={{
              name: 'ReactClientSDK',
              identifier: 'reactclientsdk',
            }}
          >
            {getStory(context) as ReactNode}
          </FFContextProvider>
        </GTMProvider>
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          dense
        />
        <CssBaseline />
      </ThemeProvider>
    );
  },
});

export default bambuUiDecorator;
