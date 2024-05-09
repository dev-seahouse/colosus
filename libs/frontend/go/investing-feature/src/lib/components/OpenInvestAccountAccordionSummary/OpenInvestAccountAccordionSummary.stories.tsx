import type { Meta, StoryObj } from '@storybook/react';
import { OpenInvestAccountAccordionSummary } from './OpenInvestAccountAccordionSummary';
import { Accordion, AccordionDetails } from '@mui/material';

const meta: Meta<typeof OpenInvestAccountAccordionSummary> = {
  component: OpenInvestAccountAccordionSummary,
  title: 'investing/components/OpenInvestAccountAccordionSummary',
};
export default meta;
type Story = StoryObj<typeof OpenInvestAccountAccordionSummary>;

export const Primary = {
  render: () => (
    <Accordion>
      <OpenInvestAccountAccordionSummary StartIcon={null}>
        Title
      </OpenInvestAccountAccordionSummary>
      <AccordionDetails>
        <div>Content</div>
      </AccordionDetails>
    </Accordion>
  ),
};
