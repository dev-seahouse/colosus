import type { Meta, StoryObj } from '@storybook/react';
import AccordionExpandIcon from './AccordionExpandIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const meta: Meta<typeof AccordionExpandIcon> = {
  component: AccordionExpandIcon,
  title: 'manage-goals/components/AccordionExpandIcon',
};
export default meta;
type Story = StoryObj<typeof AccordionExpandIcon>;

export const Primary = {
  args: {
    expanded: true,
    children: <ExpandMoreIcon color={'primary'} />,
  },
};
