import type { Meta, StoryObj } from '@storybook/react';
import { VerifyAccountForm } from './VerifyAccountForm';
import { useCoreStore } from '@bambu/go-core';

const Story: Meta<typeof VerifyAccountForm> = {
  component: VerifyAccountForm,
  title: 'Auth/components/VerifyAccountForm',
};
export default Story;

type VerifyAccountForm = StoryObj<typeof VerifyAccountForm>;

export const Primary: VerifyAccountForm = {
  args: {},
  decorators: [
    (Story) => {
      useCoreStore.setState({ name: 'WesleySnipes' });
      return Story();
    },
  ],
};
