import { Box } from '@bambu/react-ui';

import type { ReactNode } from 'react';

export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export const ManageProfileTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`manage-profile-tabpanel-${index}`}
      aria-labelledby={`manage-profile-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 5 }}>{children}</Box>}
    </div>
  );
};

export default ManageProfileTabPanel;
