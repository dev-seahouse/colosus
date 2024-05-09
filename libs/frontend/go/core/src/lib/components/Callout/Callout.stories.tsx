import type { Meta, StoryObj } from '@storybook/react';
import { Callout } from './Callout';

const meta: Meta<typeof Callout> = {
  component: Callout,
  title: 'core/components/Callout',
};
export default meta;
type Story = StoryObj<typeof Callout>;

export const Primary = {
  args: {
    children: (
      <>
        The document above contains the details of your Direct Debit mandate.
        Feel free to save a copy and we will add it to your documents store once
        you accept the Direct Debit mandate.
      </>
    ),
  },
};
