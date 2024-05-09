import type { Meta, StoryObj } from '@storybook/react';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';

import { AccordionSummary } from './AccordionSummary';

const Story: Meta<typeof AccordionSummary> = {
  component: AccordionSummary,
  title: 'AccordionSummary',
};
export default Story;

export const Primary: StoryObj<typeof AccordionSummary> = {
  args: {
    children: <Typography>Accordion</Typography>,
  },
  decorators: [
    (Story) => (
      <Accordion>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
        <AccordionDetails>Details</AccordionDetails>
      </Accordion>
    ),
  ],
};
