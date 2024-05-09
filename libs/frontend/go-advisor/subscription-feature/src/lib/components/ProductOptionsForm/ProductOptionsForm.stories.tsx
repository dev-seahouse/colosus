import type { Meta } from '@storybook/react';
import { ProductOptionsForm } from './ProductOptionsForm';

const Story: Meta<typeof ProductOptionsForm> = {
  component: ProductOptionsForm,
  title: 'Subscription/components/ProductOptionsForm',
};
export default Story;

export const Primary = {
  args: {},
};
