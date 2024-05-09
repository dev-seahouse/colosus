import type { Meta } from '@storybook/react';
import { RestorePortfolioDefaultSettingsDialog } from './RestorePortfolioDefaultSettingsDialog';

const Story: Meta<typeof RestorePortfolioDefaultSettingsDialog> = {
  component: RestorePortfolioDefaultSettingsDialog,
  title: 'Portfolios/components/RestorePortfolioDefaultSettingsDialog',
};
export default Story;

export const Default = {
  args: {
    open: true,
  },
};
