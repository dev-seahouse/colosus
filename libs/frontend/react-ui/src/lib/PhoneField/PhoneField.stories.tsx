import type { Meta } from '@storybook/react';
import { PhoneField } from './PhoneField';

const Story: Meta<typeof PhoneField> = {
  component: PhoneField,
  title: 'PhoneField',
};
export default Story;

export const Primary = {
  args: {},
};
