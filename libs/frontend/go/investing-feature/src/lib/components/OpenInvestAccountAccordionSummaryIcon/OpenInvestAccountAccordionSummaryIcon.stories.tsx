import type { Meta, StoryObj } from '@storybook/react';
import { OpenInvestAccountAccordionSummaryIcon } from './OpenInvestAccountAccordionSummaryIcon';

const meta: Meta<typeof OpenInvestAccountAccordionSummaryIcon> = {
  component: OpenInvestAccountAccordionSummaryIcon,
  title: 'investing/components/OpenInvestAccountAccordionSummaryIcon',
};
export default meta;
type Story = StoryObj<typeof OpenInvestAccountAccordionSummaryIcon>;

export const Primary = {
  args: {
    isTouched: false,
    hasError: false,
  },
};

export const Error = {
  args: {
    hasError: true,
    isTouched: true,
  },
};

export const Valid = {
  args: {
    hasError: false,
    isTouched: true,
  },
};
