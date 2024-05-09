import { Box } from '@bambu/react-ui';

export interface TabPanelProps {
  // the name of the tabs component itself, for accessibility purpose
  tabsName: string;
  children?: React.ReactNode;
  index: number;
  value: number;
}

// TODO: extract this into core
// meant to be used by the Tabs component
export function TabPanel(props: TabPanelProps) {
  const { children, value, index, tabsName, ...other } = props;

  return (
    <Box
      sx={{ py: 3 }}
      role="tabpanel"
      hidden={value !== index}
      id={`${tabsName}-tabpanel-${index}`}
      aria-labelledby={`${tabsName}-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

export default TabPanel;
