import type { Meta, StoryObj } from '@storybook/react';
import { OpenAccountFormFieldCallout } from './OpenAccountFormFieldCallout';

const meta: Meta<typeof OpenAccountFormFieldCallout> = {
  component: OpenAccountFormFieldCallout,
  title: 'investing/components/OpenAccountFormFieldCallout',
};
export default meta;
type Story = StoryObj<typeof OpenAccountFormFieldCallout>;

export const Primary = {
  args: {
    isShown: true,
    children: (
      <>
        We are sorry! We are unable to proceed with your account opening. This
        platform is currently not available to U.S citizens and residents.
      </>
    ),
  },
};
