import type { Meta } from '@storybook/react';
import AbcOutlined from '@mui/icons-material/AbcOutlined';
import { SideNavbarItem } from './SideNavbarItem';

const Story: Meta<typeof SideNavbarItem> = {
  component: SideNavbarItem,
  title: 'Auth/components/SideNavbarItem',
};
export default Story;

export const Primary = {
  args: {
    Icon: AbcOutlined,
    label: 'List',
  },
};
