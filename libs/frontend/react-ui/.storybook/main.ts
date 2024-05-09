import type { StorybookConfig } from '@storybook/react-vite';

import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'libs/frontend/react-ui/vite.config.ts',
      },
    },
  },
  stories: [
    '../src/lib/**/*.stories.mdx',
    '../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    'storybook-addon-react-router-v6',
    '@storybook/addon-a11y',
  ],
  docs: {
    autodocs: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async viteFinal(config: any) {
    return mergeConfig(config, {});
  },
};

module.exports = config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
