import type { Meta } from '@storybook/react';
import { CurrencyField } from './CurrencyField';

const Story: Meta<typeof CurrencyField> = {
  component: CurrencyField,
  title: 'CurrencyField',
};
export default Story;

export const Default = {
  args: {},
};
