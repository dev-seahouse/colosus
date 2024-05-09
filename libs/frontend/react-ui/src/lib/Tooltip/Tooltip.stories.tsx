import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'Tooltip',
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Primary = {
  args: {
    title: 'Tooltip',
    icon: <ErrorOutlineOutlinedIcon />,
  },
};

export const CustomizeFontSize = {
  args: {
    title: 'Tooltip',
    icon: <ErrorOutlineOutlinedIcon />,
    fontSize: '2rem',
  },
};
