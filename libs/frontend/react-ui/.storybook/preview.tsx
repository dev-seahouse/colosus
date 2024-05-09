import { withRouter } from 'storybook-addon-react-router-v6';

import { createBambuTheme, ThemeProvider } from '../src';

import './styles.css';
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true, // Adds the description and default columns
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const theme = createBambuTheme();

export const decorators = [
  withRouter,
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];
