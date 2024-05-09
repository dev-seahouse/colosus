import type { TabPanelProps } from '@bambu/go-manage-goals-feature';
import { Box } from '@bambu/react-ui';
import { TabPanel } from '@bambu/go-manage-goals-feature';
import AssetAllocation from '../AssetAllocation/AssetAllocation';

export function ConnectAssetAllocationPanel({
  index,
  value,
  tabsName,
  ...props
}: TabPanelProps) {
  return (
    <TabPanel index={index} value={value} tabsName={tabsName} {...props}>
      <Box sx={{ px: 1.5, margin: 'auto' }}>
        <AssetAllocation />
      </Box>
    </TabPanel>
  );
}

export default ConnectAssetAllocationPanel;
