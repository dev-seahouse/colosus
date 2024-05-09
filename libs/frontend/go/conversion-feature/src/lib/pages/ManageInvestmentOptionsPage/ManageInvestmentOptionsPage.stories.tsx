import type { Meta, StoryObj } from '@storybook/react';
import { ManageInvestmentOptionsPage } from './ManageInvestmentOptionsPage';
import { useCoreStore } from '@bambu/go-core';

const Story: Meta<typeof ManageInvestmentOptionsPage> = {
  component: ManageInvestmentOptionsPage,
  title: 'Conversion/pages/ManageInvestmentOptionsPage',
};
export default Story;
type ManageInvestmentOptionsPage = StoryObj<typeof ManageInvestmentOptionsPage>;

export const Primary: ManageInvestmentOptionsPage = {
  args: {},
  decorators: [
    (Story) => {
      useCoreStore.setState({ name: 'WesleySnipes' });
      return Story();
    },
  ],
};
