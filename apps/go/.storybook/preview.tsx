import { withRouter } from 'storybook-addon-react-router-v6';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { theme } from '../src/theme';
import { handlers } from '../src/mocks/handlers';
import {
  bambuUiDecorator,
  reactQueryDecorator,
} from '../src/storybook/decorators';

import '../src/styles.css';
import './styles.css';

initialize({});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    expanded: true, // Adds the description and default columns
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
  msw: {
    handlers,
  },
  bambuUi: {
    theme,
  },
  //👇 The viewports object from the Essentials addon
  viewport: {
    //👇 The viewports you want to use
    viewports: INITIAL_VIEWPORTS,
    //👇 Your own default viewport
    defaultViewport: 'iphone12',
  },
};

export const decorators = [
  withRouter,
  mswDecorator,
  bambuUiDecorator,
  reactQueryDecorator,
];
