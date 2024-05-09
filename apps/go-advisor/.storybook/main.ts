import type { StorybookConfig } from '@storybook/react-vite';

import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'apps/go-advisor/vite.config.ts',
      },
    },
  },
  stories: [
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
    '../../../libs/frontend/go-advisor/**/*.stories.mdx',
    '../../../libs/frontend/go-advisor/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    'storybook-addon-react-router-v6',
    '@storybook/addon-a11y',
  ],
  staticDirs: ['../public'],
  docs: {
    autodocs: true,
  },
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via Autodocs.
    reactDocgen: 'react-docgen',
    skipBabel: true,
    check: false,
  },
  async viteFinal(config: any) {
    return mergeConfig(config, {});
  },
};

module.exports = config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
