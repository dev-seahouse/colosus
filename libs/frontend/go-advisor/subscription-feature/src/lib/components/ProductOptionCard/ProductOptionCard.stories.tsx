import type { Meta } from '@storybook/react';
import { ProductOptionCard } from './ProductOptionCard';

const Story: Meta<typeof ProductOptionCard> = {
  component: ProductOptionCard,
  title: 'Subscription/components/ProductOptionCard',
};
export default Story;

export const Default = {
  args: {},
};

export const Selected = {
  args: {
    selected: true,
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};
