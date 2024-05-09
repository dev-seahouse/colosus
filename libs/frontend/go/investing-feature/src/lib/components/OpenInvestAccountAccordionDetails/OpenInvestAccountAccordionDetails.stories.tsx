import type { Meta, StoryObj } from '@storybook/react';
import { OpenInvestAccountAccordionDetails } from './OpenInvestAccountAccordionDetails';
import { Accordion } from '@bambu/react-ui';
import OpenInvestAccountAccordionSummary from '../OpenInvestAccountAccordionSummary/OpenInvestAccountAccordionSummary';

const meta: Meta<typeof OpenInvestAccountAccordionDetails> = {
  component: OpenInvestAccountAccordionDetails,
  title: 'investing/components/OpenAccountFormAccordionDetails',
};
export default meta;
type Story = StoryObj<typeof OpenInvestAccountAccordionDetails>;

export const Primary: Story = {
  args: { children: 'Content' },
  decorators: [
    (Story) => (
      <Accordion>
        <OpenInvestAccountAccordionSummary>
          Title
        </OpenInvestAccountAccordionSummary>
        <Story />
      </Accordion>
    ),
  ],
};
